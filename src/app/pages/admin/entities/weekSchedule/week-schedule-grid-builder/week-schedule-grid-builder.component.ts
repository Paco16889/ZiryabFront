import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  Input,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, forkJoin, Observable, of, last, map, catchError, mergeMap } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Assignment, AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { TimetableSlot } from '../../../../../core/models/timetable-slot';
import { gridLayoutFromWeekSchedules } from '../../../../../core/utils/week-schedule-grid-layout';
import {
  isWeekScheduleClassEligibleForGridSelector,
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
  dedupeAssignmentRowsBySubject,
  filterAssignmentOptionsForCellBySubjectHours,
  wouldExceedSubjectHoursInCell,
} from '../../../../../core/utils/week-schedule-assignment-filters';
import {
  hoursBetween,
  timeRangesOverlap,
} from '../../../../../core/utils/time-range';
import { WeekScheduleAssignmentPickerComponent } from '../week-schedule-assignment-picker/week-schedule-assignment-picker.component';
import { WeekScheduleDayCardComponent } from '../week-schedule-day-card/week-schedule-day-card.component';
import { WeekScheduleHourCardComponent } from '../week-schedule-hour-card/week-schedule-hour-card.component';

/** Clave estable: día 1–7 + inicio de franja */
export function weekScheduleCellKey(weekDay: number, startTime: string): string {
  return `${weekDay}|${startTime}`;
}

export interface GridCellState {
  /** Ausente en celdas de plantilla materializada aún sin asignatura. */
  idTeacherAssignment?: number;
  serverId?: number;
  label: string;
  idTeacher?: number;
  idSubject?: number;
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
export class WeekScheduleGridBuilderComponent implements OnInit, OnChanges {
  private readonly assignmentData = inject(WeekScheduleAssignmentDataService);
  private readonly classesApi = inject(WeekScheduleClassesHttpService);
  private readonly teachersApi = inject(TeachersService);
  private readonly schedules = inject(WeekScheduleService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly scheduleSaved = output<void>();

  /** En pestaña grid del shell: oculta cabecera propia (atrás / título). @see CURSO-91 */
  readonly embedded = input(false);

  /** Tras materializar en pestaña create: preseleccionar esta clase (CURSO-145). */
  @Input() preselectClassKey: string | null = null;

  /** Días y franjas de la plantilla de la clase seleccionada (no fijos del environment). */
  readonly gridWeekdays = signal<number[]>([]);
  readonly gridSlots = signal<TimetableSlot[]>([]);

  readonly classes = signal<WeekScheduleClassItem[]>([]);
  readonly classesLoadError = signal(false);
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);
  readonly selectedClassKey = signal('');

  readonly selectedGroupId = computed(() => this.selectedClass()?.group.id ?? null);

  readonly schoolYear = signal<string>(environment.currentSchoolYear);

  readonly assignments = signal<TeacherSubjectAssignmentRow[]>([]);
  readonly teacherNameById = signal<Map<number, string>>(new Map());
  readonly cells = signal<Map<string, GridCellState>>(new Map());

  private initialServerSchedules = signal<WeekSchedule[]>([]);
  /** Caché de `GET /horarios-semanales` de `loadClasses` (evita repetir al elegir clase). */
  private allSchedulesCache = signal<WeekSchedule[]>([]);

  readonly loading = signal(false);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal(false);
  readonly validationMessages = signal<string[]>([]);

  readonly sortedAssignmentOptions = computed(() => {
    const rows = dedupeAssignmentRowsBySubject(this.assignments());
    const names = this.teacherNameById();
    return [...rows].sort((a, b) => {
      const bySub = (a.subject?.name ?? '').localeCompare(b.subject?.name ?? '');
      if (bySub !== 0) {
        return bySub;
      }
      return (names.get(a.idTeacher) ?? '').localeCompare(names.get(b.idTeacher) ?? '');
    });
  });

  readonly canShowGrid = computed(
    () =>
      this.selectedClass() != null &&
      this.gridWeekdays().length > 0 &&
      this.gridSlots().length > 0 &&
      (this.assignments().length > 0 || this.cells().size > 0),
  );

  readonly classKey = weekScheduleClassKey;

  ngOnInit(): void {
    this.loadClasses();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['preselectClassKey'] && this.classes().length > 0) {
      this.tryPreselectClass();
    }
  }

  loadClasses(): void {
    this.classesLoadError.set(false);
    forkJoin({
      classes: this.classesApi.getAllClasses(this.schoolYear()),
      schedules: this.schedules.getAllSchedules(),
    }).subscribe({
      next: ({ classes, schedules }) => {
        const allSchedules = schedules.success ? schedules.data : [];
        this.allSchedulesCache.set(allSchedules);
        const list = classes.success
          ? [...classes.data]
              .filter((c) => isWeekScheduleClassEligibleForGridSelector(c, allSchedules))
              .sort((a, b) => a.label.localeCompare(b.label))
          : [];
        this.classes.set(list);
        this.tryPreselectClass();
      },
      error: () => this.classesLoadError.set(true),
    });
  }

  private tryPreselectClass(): void {
    const key = this.preselectClassKey;
    if (!key || this.selectedClassKey() === key) {
      return;
    }
    const cls = this.classes().find((c) => weekScheduleClassKey(c) === key);
    if (cls) {
      this.onClassSelected(key);
    }
  }

  onClassSelected(key: string): void {
    this.selectedClassKey.set(key);
    const cls = key
      ? (this.classes().find((c) => weekScheduleClassKey(c) === key) ?? null)
      : null;
    this.selectedClass.set(cls);
    this.assignments.set([]);
    this.cells.set(new Map());
    this.initialServerSchedules.set([]);
    this.gridWeekdays.set([]);
    this.gridSlots.set([]);
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
        cls.label,
        this.allSchedulesCache(),
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
        const layout = gridLayoutFromWeekSchedules(ctx.weekSchedules);
        this.gridWeekdays.set(layout.weekDays);
        this.gridSlots.set(layout.slots);
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
      const weekDay = Number(ws.weekDay);
      const key = weekScheduleCellKey(weekDay, ws.startTime);
      if (ta == null) {
        m.set(key, {
          serverId: ws.id,
          label: '',
          weekDay,
          startTime: ws.startTime,
          finishTime: ws.finishTime,
        });
        continue;
      }
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
    const nested = (ta as AssignmentWithIncludes).subject?.name?.trim();
    if (nested) {
      return nested;
    }
    return `Assignment ${ta.id}`;
  }

  assignmentOptionLabel(row: TeacherSubjectAssignmentRow): string {
    return row.subject?.name?.trim() || `#${row.idSubject}`;
  }

  cellKey(day: number, slot: TimetableSlot): string {
    return weekScheduleCellKey(day, slot.startTime);
  }

  cellAt(day: number, slot: TimetableSlot): GridCellState | undefined {
    return this.cells().get(this.cellKey(day, slot));
  }

  /** Todas las asignaturas del ciclo+grade con horas libres; misma lista en cada celda. */
  optionsForCell(day: number, slot: TimetableSlot): TeacherSubjectAssignmentRow[] {
    const key = this.cellKey(day, slot);
    return filterAssignmentOptionsForCellBySubjectHours(
      this.sortedAssignmentOptions(),
      this.cells(),
      key,
    );
  }

  cellAssignmentSelectValue(day: number, slot: TimetableSlot): string {
    const c = this.cellAt(day, slot);
    if (c?.idTeacherAssignment == null) {
      return '';
    }
    return String(c.idTeacherAssignment);
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
    if (
      wouldExceedSubjectHoursInCell(
        row,
        this.cells(),
        key,
        slot.startTime,
        slot.finishTime,
      )
    ) {
      const declared = row.subject?.hours ?? 0;
      let used = 0;
      for (const [, cell] of this.cells()) {
        if (cell.idSubject === row.idSubject && cell.idTeacherAssignment != null) {
          used += hoursBetween(cell.startTime, cell.finishTime);
        }
      }
      this.validationMessages.set([
        this.translate.instant('weekScheduleBuilder.grid.validationSubjectHours', {
          subject: this.assignmentOptionLabel(row),
          max: declared,
          current: String(used + hoursBetween(slot.startTime, slot.finishTime)),
        }),
      ]);
      return;
    }
    const prev = this.cells().get(key);
    const next = new Map(this.cells());
    next.set(key, {
      idTeacherAssignment: row.id,
      serverId: prev?.serverId,
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
    const prev = this.cells().get(key);
    const next = new Map(this.cells());
    if (prev?.serverId != null) {
      next.set(key, {
        serverId: prev.serverId,
        label: '',
        weekDay: day,
        startTime: slot.startTime,
        finishTime: slot.finishTime,
      });
    } else {
      next.delete(key);
    }
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
    const list = [...this.cells().values()].filter((c) => c.idTeacherAssignment != null);

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
      const subjectId = c.idSubject;
      if (subjectId == null || warnedSubjects.has(subjectId)) {
        continue;
      }
      const declared = this.assignments().find((r) => r.idSubject === subjectId)
        ?.subject?.hours;
      if (declared != null && declared > 0) {
        let sum = 0;
        for (const x of list) {
          if (x.idSubject === subjectId) {
            sum += hoursBetween(x.startTime, x.finishTime);
          }
        }
        if (sum > declared + 1e-6) {
          warnedSubjects.add(subjectId);
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
    const cells = [...this.cells().values()].filter(
      (c) => c.idTeacherAssignment != null && c.idTeacher != null,
    );
    const teacherIds = [...new Set(cells.map((c) => c.idTeacher!))];
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
            (s) => s.teacherAssignment?.idGroup !== groupId,
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
      byKeyInitial.set(weekScheduleCellKey(Number(ws.weekDay), ws.startTime), ws);
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
      const prevAssignmentId = prev?.teacherAssignment?.id ?? null;
      const cellAssignmentId = cell.idTeacherAssignment ?? null;

      if (!prev) {
        if (cellAssignmentId == null) {
          continue;
        }
        ops.push(
          this.schedules
            .createSchedule({
              idTeacherAssignment: cellAssignmentId,
              weekDay: cell.weekDay,
              startTime: cell.startTime,
              finishTime: cell.finishTime,
            })
            .pipe(catchError((e) => {
              throw e;
            })),
        );
      } else if (prevAssignmentId == null && cellAssignmentId != null) {
        ops.push(
          this.schedules
            .updateSchedule(prev.id, {
              id: prev.id,
              idTeacherAssignment: cellAssignmentId,
              weekDay: cell.weekDay,
              startTime: cell.startTime,
              finishTime: cell.finishTime,
            })
            .pipe(catchError((e) => {
              throw e;
            })),
        );
      } else if (
        prevAssignmentId != null &&
        cellAssignmentId != null &&
        prevAssignmentId !== cellAssignmentId
      ) {
        ops.push(
          this.schedules.deleteSchedule(prev.id).pipe(
            mergeMap(() =>
              this.schedules.createSchedule({
                idTeacherAssignment: cellAssignmentId,
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
