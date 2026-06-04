import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { concat, forkJoin, Observable, of, last, map, catchError, mergeMap } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Assignment, AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { TimetableSlot } from '../../../../../core/models/timetable-slot';
import { gridLayoutFromWeekSchedules } from '../../../../../core/utils/week-schedule-grid-layout';
import {
  isWeekScheduleClassEligibleForGridSelector,
  schedulesForClass,
  WeekScheduleClassItem,
  weekScheduleClassKey,
} from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { TeacherSubjectAssignmentRow } from '../../../../../core/models/teacher/subjectforteacher';
import { assignmentWithIncludesToTeacherRow } from '../../../../../core/utils/week-schedule-assignment-mapper';
import { AssignmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/teacher-assignment-http.service';
import { WeekSchedule } from '../../../../../core/models/week-schedule';
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

/**
 * Clave estable de celda en la rejilla: día 1–7 + hora de inicio de franja.
 * @param weekDay Día de la semana (1 = lunes).
 * @param startTime Hora de inicio (`HH:mm`).
 */
export function weekScheduleCellKey(weekDay: number, startTime: string): string {
  return `${weekDay}|${startTime}`;
}

/** Estado de una celda de la rejilla semanal (asignación + metadatos de franja). */
export interface GridCellState {
  /** Ausente en celdas de plantilla materializada aún sin asignatura. */
  idTeacherAssignment?: number;

  /** Id del `WeekSchedule` persistido en servidor, si existe. */
  serverId?: number;

  /** Texto mostrado en la celda (asignatura / profesor). */
  label: string;

  /** Profesor de la asignación seleccionada. */
  idTeacher?: number;

  /** Asignatura de la celda. */
  idSubject?: number;

  /** Día de la semana (1–7). */
  weekDay: number;

  /** Inicio de la franja (`HH:mm`). */
  startTime: string;

  /** Fin de la franja (`HH:mm`). */
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
    FormsModule,
    TranslateModule,
    WeekScheduleAssignmentPickerComponent,
    WeekScheduleDayCardComponent,
    WeekScheduleHourCardComponent,
  ],
  templateUrl: './week-schedule-grid-builder.component.html',
  styleUrl: './week-schedule-grid-builder.component.scss',
})
export class WeekScheduleGridBuilderComponent {
  /** Asignaciones y horarios existentes de la clase seleccionada. */
  private readonly assignmentData = inject(WeekScheduleAssignmentDataService);

  /** Listado de clases con plantilla para el selector. */
  private readonly classesApi = inject(WeekScheduleClassesHttpService);

  /** Asignaciones globales para calcular horas pendientes por asignatura. */
  private readonly assignmentHttp = inject(AssignmentHttpService);

  /** Nombres de profesores para etiquetas de celdas. */
  private readonly teachersApi = inject(TeachersService);

  /** CRUD de `WeekSchedule` y recarga tras guardar. */
  private readonly schedules = inject(WeekScheduleService);

  /** Etiquetas de días y mensajes de validación i18n. */
  private readonly translate = inject(TranslateService);

  /** El shell vuelve a la pestaña anterior sin guardar. */
  readonly cancelCreate = output<void>();

  /** Notifica al padre que la rejilla se persistió correctamente. */
  readonly scheduleSaved = output<void>();

  /** En pestaña grid del shell: oculta cabecera propia (atrás / título). @see CURSO-91 */
  readonly embedded = input(false);

  /** Tras materializar en pestaña create: preseleccionar esta clase (CURSO-145). */
  readonly preselectClassKey = input<string | null>(null);

  /** Clase recién creada; se incluye en el selector aunque el filtro aún no la liste. */
  readonly preselectClass = input<WeekScheduleClassItem | null>(null);

  /** El padre incrementa al abrir la pestaña rejilla para recargar el selector. */
  readonly listRefreshToken = input(0);

  /** Ignora respuestas HTTP obsoletas de `loadClasses`. */
  private classesLoadSeq = 0;

  /** Ignora respuestas HTTP obsoletas de `loadClassContext`. */
  private contextLoadSeq = 0;

  /** Días y franjas de la plantilla de la clase seleccionada (no fijos del environment). */
  /** Días de la semana presentes en la plantilla de la clase. */
  readonly gridWeekdays = signal<number[]>([]);

  /** Franjas horarias de la plantilla (inicio/fin). */
  readonly gridSlots = signal<TimetableSlot[]>([]);

  /** Clases con plantilla elegibles para el desplegable. */
  readonly classes = signal<WeekScheduleClassItem[]>([]);

  /** Error al cargar el listado de clases. */
  readonly classesLoadError = signal(false);

  /** Clase `(course, grade, group, schoolYear)` activa en la rejilla. */
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);

  /** Clave estable de la clase seleccionada. */
  readonly selectedClassKey = signal('');

  /** Id del grupo de la clase seleccionada (validaciones y persistencia). */
  readonly selectedGroupId = computed(() => this.selectedClass()?.group.id ?? null);

  /** Año escolar del listado y de las peticiones. */
  readonly schoolYear = signal<string>(environment.currentSchoolYear);

  /** Asignaciones docente–asignatura del ciclo+grade de la clase. */
  readonly assignments = signal<TeacherSubjectAssignmentRow[]>([]);

  /** Mapa id profesor → nombre para etiquetas de opciones. */
  readonly teacherNameById = signal<Map<number, string>>(new Map());

  /** Estado editable de cada celda (clave `weekScheduleCellKey`). */
  readonly cells = signal<Map<string, GridCellState>>(new Map());

  /** Snapshot del servidor al cargar la clase (diff al guardar). */
  private initialServerSchedules = signal<WeekSchedule[]>([]);

  /** Caché de `GET /horarios-semanales` de `loadClasses` (evita repetir al elegir clase). */
  private allSchedulesCache = signal<WeekSchedule[]>([]);

  /** Caché de assignments del año para el filtro del selector. */
  private allAssignmentsCache = signal<TeacherSubjectAssignmentRow[]>([]);

  /** Carga de clase, asignaciones y rejilla en curso. */
  readonly loading = signal(false);

  /** Error al cargar contexto de la clase seleccionada. */
  readonly loadError = signal(false);

  /** Persistencia del diff en curso. */
  readonly saving = signal(false);

  /** Error al guardar cambios en el servidor. */
  readonly saveError = signal(false);

  /** Mensajes de validación local y de solapes de profesor. */
  readonly validationMessages = signal<string[]>([]);

  /** Opciones de asignación ordenadas por asignatura y profesor. */
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

  /** La rejilla se muestra cuando hay clase, días, franjas y datos de celdas. */
  readonly canShowGrid = computed(
    () =>
      this.selectedClass() != null &&
      this.gridWeekdays().length > 0 &&
      this.gridSlots().length > 0 &&
      (this.assignments().length > 0 || this.cells().size > 0),
  );

  /** Referencia a `weekScheduleClassKey` para el template. */
  readonly classKey = weekScheduleClassKey;

  constructor() {
    effect(() => {
      this.listRefreshToken();
      this.preselectClassKey();
      this.loadClasses();
    });
  }

  /** Obtiene clases elegibles y caché global de horarios semanales. */
  loadClasses(onComplete?: () => void): void {
    const seq = ++this.classesLoadSeq;
    this.classesLoadError.set(false);
    forkJoin({
      classes: this.classesApi.getAllClasses(this.schoolYear()),
      schedules: this.schedules.getAllSchedules(),
      assignments: this.assignmentHttp.getAll(),
    }).subscribe({
      next: ({ classes, schedules, assignments }) => {
        if (seq !== this.classesLoadSeq) {
          return;
        }
        const allSchedules = schedules.success ? schedules.data : [];
        const allAssignments = assignments.success
          ? assignments.data.map((a) => assignmentWithIncludesToTeacherRow(a))
          : [];
        this.allSchedulesCache.set(allSchedules);
        this.allAssignmentsCache.set(allAssignments);
        const list = classes.success
          ? this.mergePreselectClass(
              [...classes.data]
                .filter((c) =>
                  isWeekScheduleClassEligibleForGridSelector(c, allSchedules, allAssignments),
                )
                .sort((a, b) => a.label.localeCompare(b.label)),
            )
          : [];
        this.applyClassListAfterLoad(list);
        onComplete?.();
      },
      error: () => {
        if (seq === this.classesLoadSeq) {
          this.classesLoadError.set(true);
        }
      },
    });
  }

  /** Tras actualizar el desplegable: preselección, recarga de rejilla o limpieza. */
  private applyClassListAfterLoad(list: WeekScheduleClassItem[]): void {
    this.classes.set(list);
    const preselectKey = this.preselectClassKey();
    if (preselectKey) {
      this.selectClassAndLoadGrid(preselectKey);
      return;
    }
    const currentKey = this.selectedClassKey();
    if (!currentKey) {
      return;
    }
    if (!list.some((c) => weekScheduleClassKey(c) === currentKey)) {
      this.clearGridSelection();
      return;
    }
    this.selectClassAndLoadGrid(currentKey);
  }

  /** Incluye la clase recién materializada solo si aún tiene franjas por asignar. */
  private mergePreselectClass(list: WeekScheduleClassItem[]): WeekScheduleClassItem[] {
    const pending = this.preselectClass();
    const key = this.preselectClassKey();
    if (pending == null || key == null || weekScheduleClassKey(pending) !== key) {
      return list;
    }
    if (list.some((c) => weekScheduleClassKey(c) === key)) {
      return list;
    }
    const schedules = this.allSchedulesCache();
    const assignments = this.allAssignmentsCache();
    if (
      schedulesForClass(pending, schedules).length > 0 &&
      !isWeekScheduleClassEligibleForGridSelector(pending, schedules, assignments)
    ) {
      return list;
    }
    return [...list, { ...pending, hasWeekSchedule: true }].sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }

  /** Resuelve la clase por clave, con fallback a la preselección del padre. */
  private resolveClassByKey(key: string): WeekScheduleClassItem | null {
    const fromList = this.classes().find((c) => weekScheduleClassKey(c) === key);
    if (fromList) {
      return fromList;
    }
    const pending = this.preselectClass();
    if (pending != null && weekScheduleClassKey(pending) === key) {
      return pending;
    }
    return null;
  }

  /** Selecciona una clase y carga su rejilla (siempre tras tener listado y cachés listos). */
  private selectClassAndLoadGrid(key: string): void {
    const merged = this.mergePreselectClass(this.classes());
    if (merged.length !== this.classes().length) {
      this.classes.set(merged);
    }
    const cls = this.resolveClassByKey(key);
    if (cls == null) {
      return;
    }
    this.selectedClassKey.set(key);
    this.selectedClass.set(cls);
    this.resetGridEditorState();
    this.loadClassContext(cls);
  }

  /** Vacía selección y estado de la rejilla. */
  private clearGridSelection(): void {
    this.selectedClassKey.set('');
    this.selectedClass.set(null);
    this.resetGridEditorState();
    this.loading.set(false);
    this.loadError.set(false);
  }

  /** Limpia celdas y layout antes de cargar otra clase. */
  private resetGridEditorState(): void {
    this.assignments.set([]);
    this.cells.set(new Map());
    this.initialServerSchedules.set([]);
    this.gridWeekdays.set([]);
    this.gridSlots.set([]);
    this.validationMessages.set([]);
    this.teacherNameById.set(new Map());
  }

  /** Carga asignaciones, layout y celdas al elegir una clase del desplegable. */
  onClassSelected(key: string): void {
    if (!key) {
      this.clearGridSelection();
      return;
    }
    this.selectClassAndLoadGrid(key);
  }

  /** Carga oferta docente y rejilla de la clase indicada. */
  private loadClassContext(cls: WeekScheduleClassItem): void {
    const seq = ++this.contextLoadSeq;
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
        if (seq !== this.contextLoadSeq) {
          return;
        }
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
        if (seq !== this.contextLoadSeq) {
          return;
        }
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }

  /** Convierte horarios del API en mapa de celdas editables. */
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

  /** Etiqueta legible de una asignación para mostrar en celda. */
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

  /** Nombre de asignatura (o fallback con id) para opciones y celdas. */
  assignmentOptionLabel(row: TeacherSubjectAssignmentRow): string {
    return row.subject?.name?.trim() || `#${row.idSubject}`;
  }

  /** Clave de celda para día y franja. */
  cellKey(day: number, slot: TimetableSlot): string {
    return weekScheduleCellKey(day, slot.startTime);
  }

  /** Estado de celda en día y franja, si existe. */
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

  /** Valor del `<select>` de asignación (`idTeacherAssignment` como string). */
  cellAssignmentSelectValue(day: number, slot: TimetableSlot): string {
    const c = this.cellAt(day, slot);
    if (c?.idTeacherAssignment == null) {
      return '';
    }
    return String(c.idTeacherAssignment);
  }

  /** Asigna o quita docente–asignatura en una celda (valida horas de asignatura). */
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

  /** Vacía la asignación de una celda (mantiene `serverId` si ya existía en servidor). */
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

  /** Etiqueta i18n del día de la semana (1–7). */
  weekdayLabel(day: number): string {
    return this.translate.instant(`weekScheduleBuilder.days.${day}`);
  }

  /** Valida solapes en grupo y horas declaradas por asignatura. */
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

  /**
   * Comprueba solapes de horario del profesor en otros grupos.
   * @param groupId Grupo de la clase actual (horarios externos se comparan con él).
   */
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

  /** Valida, comprueba profesores y persiste el diff contra el servidor. */
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
            this.loadClasses(() => this.scheduleSaved.emit());
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

  /** Crea, actualiza o borra `WeekSchedule` según diferencias con `initialServerSchedules`. */
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

  /** Emite cancelación al shell padre. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
