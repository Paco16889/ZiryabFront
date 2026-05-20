import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, forkJoin, Observable, of, last, map, catchError, mergeMap } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Assignment } from '../../../../../core/models/assingment';
import { TimetableSlot } from '../../../../../core/models/timetable-slot';
import {
  WeekScheduleClassItem,
  weekScheduleClassKey,
} from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekSchedule } from '../../../../../core/models/week-schedule';
import { TeacherSubjectAssignmentRow } from '../../../../../core/models/teacher/subjectforteacher';
import { WeekScheduleAssignmentDataService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule-assignment-data.service';
import { WeekScheduleClassesHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule-classes-http.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import {
  hoursBetween,
  timeRangesOverlap,
} from '../../../../../core/utils/time-range';
import { prismaDayOfWeekToNumber } from '../../../../../core/utils/week-day';
import { WeekScheduleAssignmentPickerComponent } from '../week-schedule-assignment-picker/week-schedule-assignment-picker.component';
import { WeekScheduleDayCardComponent } from '../week-schedule-day-card/week-schedule-day-card.component';
import { WeekScheduleHourCardComponent } from '../week-schedule-hour-card/week-schedule-hour-card.component';

/** Clave estable: día 1–7 + inicio de franja */
export function weekScheduleCellKey(weekDay: number, startTime: string): string {
  return `${weekDay}|${startTime}`;
}

export interface GridCellState {
  idTeacherAssignment: number;
  serverId?: number;
  label: string;
  idTeacher: number;
  idSubject: number;
  weekDay: number;
  startTime: string;
  finishTime: string;
}

/**
 * Constructor por días: una **clase** `(course, grade, group, schoolYear)` define el
 * conjunto de `Assignment`; cada franja lleva un desplegable docente–asignatura.
 */
@Component({
  selector: 'app-week-schedule-grid-builder',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    WeekScheduleAssignmentPickerComponent,
    WeekScheduleDayCardComponent,
    WeekScheduleHourCardComponent,
  ],
  templateUrl: './week-schedule-grid-builder.component.html',
  styleUrl: './week-schedule-grid-builder.component.scss',
})
export class WeekScheduleGridBuilderComponent implements OnInit {
  private readonly assignmentData = inject(WeekScheduleAssignmentDataService);
  private readonly classesApi = inject(WeekScheduleClassesHttpService);
  private readonly teachersApi = inject(TeachersService);
  private readonly schedules = inject(WeekScheduleService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly scheduleSaved = output<void>();

  /** En pestaña grid del shell: oculta cabecera propia (atrás / título). @see CURSO-91 */
  readonly embedded = input(false);

  readonly weekdays = [1, 2, 3, 4, 5] as const;
  readonly slots: TimetableSlot[] = [...environment.timetableSlots];

  readonly classes = signal<WeekScheduleClassItem[]>([]);
  readonly classesLoadError = signal(false);
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);

  readonly selectedGroupId = computed(() => this.selectedClass()?.group.id ?? null);

  readonly schoolYear = signal<string>(environment.currentSchoolYear);

  readonly assignments = signal<TeacherSubjectAssignmentRow[]>([]);
  readonly teacherNameById = signal<Map<number, string>>(new Map());
  readonly cells = signal<Map<string, GridCellState>>(new Map());

  private initialServerSchedules = signal<WeekSchedule[]>([]);

  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal(false);
  readonly validationMessages = signal<string[]>([]);

  readonly sortedAssignmentOptions = computed(() => {
    const rows = this.assignments();
    const names = this.teacherNameById();
    return [...rows].sort((a, b) => {
      const bySub = a.subject.name.localeCompare(b.subject.name);
      if (bySub !== 0) {
        return bySub;
      }
      return (names.get(a.idTeacher) ?? '').localeCompare(names.get(b.idTeacher) ?? '');
    });
  });

  readonly classKey = weekScheduleClassKey;

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classesLoadError.set(false);
    this.classesApi.getAllClasses(this.schoolYear()).subscribe({
      next: (res) => {
        this.classes.set(
          res.success ? [...res.data].sort((a, b) => a.label.localeCompare(b.label)) : [],
        );
      },
      error: () => this.classesLoadError.set(true),
    });
  }

  onClassSelected(key: string): void {
    const cls = key
      ? (this.classes().find((c) => weekScheduleClassKey(c) === key) ?? null)
      : null;
    this.selectedClass.set(cls);
    this.assignments.set([]);
    this.cells.set(new Map());
    this.initialServerSchedules.set([]);
    this.validationMessages.set([]);
    this.teacherNameById.set(new Map());
    if (cls == null) {
      return;
    }
    this.loading.set(true);
    this.loadError.set(false);
    forkJoin({
      ctx: this.assignmentData.fetchClassScheduleContext(
        cls.course.id,
        cls.grade,
        cls.group.id,
        cls.schoolYear,
      ),
      teachers: this.teachersApi.getAllTeachers(),
    }).subscribe({
      next: ({ ctx, teachers }) => {
        const nameMap = new Map<number, string>();
        if (teachers.success) {
          for (const t of teachers.data) {
            const full = [t.name, t.surname].filter(Boolean).join(' ').trim();
            nameMap.set(t.id, full || t.email || `#${t.id}`);
          }
        }
        this.teacherNameById.set(nameMap);
        this.assignments.set(ctx.assignments);
        this.initialServerSchedules.set(ctx.weekSchedules);
        this.cells.set(this.mapServerToCells(ctx.weekSchedules));
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  private mapServerToCells(list: WeekSchedule[]): Map<string, GridCellState> {
    const m = new Map<string, GridCellState>();
    for (const ws of list) {
      const ta = ws.teacherAssignment;
      const weekDay = prismaDayOfWeekToNumber(ws.weekDay as string | number);
      const key = weekScheduleCellKey(weekDay, ws.startTime);
      m.set(key, {
        idTeacherAssignment: ta.id,
        serverId: ws.id,
        label: this.cellLabelFromAssignment(ta),
        idTeacher: ta.idTeacher,
        idSubject: ta.idSubject,
        weekDay,
        startTime: ws.startTime,
        finishTime: ws.finishTime,
      });
    }
    return m;
  }

  private cellLabelFromAssignment(ta: Assignment): string {
    const rows = this.assignments();
    const row = rows.find((r) => r.id === ta.id);
    if (row) {
      return this.assignmentOptionLabel(row);
    }
    return `Assignment ${ta.id}`;
  }

  assignmentOptionLabel(row: TeacherSubjectAssignmentRow): string {
    const t = this.teacherNameById().get(row.idTeacher);
    const sub = row.subject.name;
    if (t) {
      return this.translate.instant('weekScheduleBuilder.grid.optionSubjectTeacher', {
        subject: sub,
        teacher: t,
      });
    }
    return sub;
  }

  cellKey(day: number, slot: TimetableSlot): string {
    return weekScheduleCellKey(day, slot.startTime);
  }

  cellAt(day: number, slot: TimetableSlot): GridCellState | undefined {
    return this.cells().get(this.cellKey(day, slot));
  }

  cellAssignmentSelectValue(day: number, slot: TimetableSlot): string {
    const c = this.cellAt(day, slot);
    return c ? String(c.idTeacherAssignment) : '';
  }

  onCellAssignmentChange(day: number, slot: TimetableSlot, assignmentId: number | null): void {
    if (assignmentId == null) {
      this.clearCell(day, slot);
      return;
    }
    const row = this.assignments().find((r) => r.id === assignmentId);
    if (!row) {
      return;
    }
    const key = this.cellKey(day, slot);
    const next = new Map(this.cells());
    next.set(key, {
      idTeacherAssignment: row.id,
      label: this.assignmentOptionLabel(row),
      idTeacher: row.idTeacher,
      idSubject: row.idSubject,
      weekDay: day,
      startTime: slot.startTime,
      finishTime: slot.finishTime,
    });
    this.cells.set(next);
    this.validationMessages.set([]);
  }

  clearCell(day: number, slot: TimetableSlot): void {
    const key = this.cellKey(day, slot);
    const next = new Map(this.cells());
    next.delete(key);
    this.cells.set(next);
    this.validationMessages.set([]);
  }

  weekdayLabel(day: number): string {
    return this.translate.instant(`weekScheduleBuilder.days.${day}`);
  }

  runValidation(): boolean {
    const msgs: string[] = [];
    const groupId = this.selectedGroupId();
    if (this.selectedClass() == null || groupId == null) {
      msgs.push(this.translate.instant('weekScheduleBuilder.grid.validationNoClass'));
      this.validationMessages.set(msgs);
      return false;
    }
    const list = [...this.cells().values()];

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (
          a.weekDay === b.weekDay &&
          timeRangesOverlap(a.startTime, a.finishTime, b.startTime, b.finishTime)
        ) {
          msgs.push(
            this.translate.instant('weekScheduleBuilder.grid.validationGroupOverlap', {
              a: a.label,
              b: b.label,
              day: a.weekDay,
            }),
          );
        }
      }
    }

    const warnedSubjects = new Set<number>();
    for (const c of list) {
      if (warnedSubjects.has(c.idSubject)) {
        continue;
      }
      const declared = this.assignments().find((r) => r.idSubject === c.idSubject)
        ?.subject?.hours;
      if (declared != null && declared > 0) {
        let sum = 0;
        for (const x of list) {
          if (x.idSubject === c.idSubject) {
            sum += hoursBetween(x.startTime, x.finishTime);
          }
        }
        if (sum > declared + 1e-6) {
          warnedSubjects.add(c.idSubject);
          msgs.push(
            this.translate.instant('weekScheduleBuilder.grid.validationSubjectHours', {
              subject: c.label,
              max: declared,
              current: String(sum),
            }),
          );
        }
      }
    }

    this.validationMessages.set(msgs);
    return msgs.length === 0;
  }

  validateTeachers$(groupId: number): Observable<string[]> {
    const cells = [...this.cells().values()];
    const teacherIds = [...new Set(cells.map((c) => c.idTeacher))];
    if (teacherIds.length === 0) {
      return of([]);
    }
    return forkJoin(
      teacherIds.map((tid) =>
        this.schedules.getSchedulesByTeacher(tid).pipe(
          map((res) => ({ tid, res })),
          catchError(() => of({ tid, res: { success: false, data: [] as WeekSchedule[], count: 0 } })),
        ),
      ),
    ).pipe(
      map((bundles) => {
        const extra: string[] = [];
        for (const { tid, res } of bundles) {
          if (!res.success) {
            continue;
          }
          const external = res.data.filter(
            (s) => s.teacherAssignment.idGroup !== groupId,
          );
          for (const cell of cells.filter((c) => c.idTeacher === tid)) {
            for (const ex of external) {
              if (
                ex.weekDay === cell.weekDay &&
                timeRangesOverlap(
                  cell.startTime,
                  cell.finishTime,
                  ex.startTime,
                  ex.finishTime,
                )
              ) {
                extra.push(
                  this.translate.instant('weekScheduleBuilder.grid.validationTeacherOverlap', {
                    label: cell.label,
                    day: cell.weekDay,
                  }),
                );
              }
            }
          }
        }
        return extra;
      }),
    );
  }

  save(): void {
    if (!this.runValidation()) {
      return;
    }
    const groupId = this.selectedGroupId();
    if (groupId == null) {
      return;
    }
    this.saveError.set(false);
    this.saving.set(true);
    this.validateTeachers$(groupId).subscribe({
      next: (teacherMsgs) => {
        if (teacherMsgs.length > 0) {
          this.validationMessages.set([...this.validationMessages(), ...teacherMsgs]);
          this.saving.set(false);
          return;
        }
        this.persistDiff$(groupId).subscribe({
          next: () => {
            this.saving.set(false);
            this.schedules.loadSchedules();
            this.scheduleSaved.emit();
          },
          error: () => {
            this.saving.set(false);
            this.saveError.set(true);
          },
        });
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(true);
      },
    });
  }

  private persistDiff$(_groupId: number): Observable<unknown> {
    const initial = this.initialServerSchedules();
    const byKeyInitial = new Map<string, WeekSchedule>();
    for (const ws of initial) {
      const weekDay = prismaDayOfWeekToNumber(ws.weekDay as string | number);
      byKeyInitial.set(weekScheduleCellKey(weekDay, ws.startTime), ws);
    }
    const current = this.cells();
    const ops: Observable<unknown>[] = [];

    for (const [key, ws] of byKeyInitial) {
      if (!current.has(key)) {
        ops.push(
          this.schedules.deleteSchedule(ws.id).pipe(
            catchError(() => of(null)),
          ),
        );
      }
    }

    for (const [key, cell] of current) {
      const prev = byKeyInitial.get(key);
      if (!prev) {
        ops.push(
          this.schedules
            .createSchedule({
              idTeacherAssignment: cell.idTeacherAssignment,
              weekDay: cell.weekDay,
              startTime: cell.startTime,
              finishTime: cell.finishTime,
            })
            .pipe(catchError((e) => {
              throw e;
            })),
        );
      } else if (prev.teacherAssignment.id !== cell.idTeacherAssignment) {
        ops.push(
          this.schedules.deleteSchedule(prev.id).pipe(
            mergeMap(() =>
              this.schedules.createSchedule({
                idTeacherAssignment: cell.idTeacherAssignment,
                weekDay: cell.weekDay,
                startTime: cell.startTime,
                finishTime: cell.finishTime,
              }),
            ),
            catchError((e) => {
              throw e;
            }),
          ),
        );
      } else if (
        prev.weekDay !== cell.weekDay ||
        prev.startTime !== cell.startTime ||
        prev.finishTime !== cell.finishTime
      ) {
        ops.push(
          this.schedules
            .updateSchedule(prev.id, {
              id: prev.id,
              weekDay: cell.weekDay,
              startTime: cell.startTime,
              finishTime: cell.finishTime,
            })
            .pipe(catchError((e) => {
              throw e;
            })),
        );
      }
    }

    if (ops.length === 0) {
      return of(null);
    }
    return concat(...ops).pipe(last());
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
