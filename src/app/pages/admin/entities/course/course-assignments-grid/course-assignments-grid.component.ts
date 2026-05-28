import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { AssignmentBulkCreateItem } from '../../../../../core/models/course-assignments/course-assignments-api.model';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';
import { CourseAssignmentGridRow } from '../../../../../core/models/course-assignments/course-assignment-grid-row.model';
import { Group } from '../../../../../core/models/group';
import { Teacher } from '../../../../../core/models/teacher';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { WeekScheduleNavigationService } from '../../../../../core/services/UI/week-schedule-navigation.service';
import { environment } from '../../../../../../environments/environment';
/** Resumen mostrado tras guardar asignaciones docentes en lote. */
export type CourseAssignmentsSaveFeedback = {
  /** Filas nuevas persistidas en el backend. */
  created: number;

  /** Filas ignoradas por duplicado. */
  duplicates: number;

  /** Filas con profesor o grupo incompleto. */
  incomplete: number;

  /** Indica error de API o errores parciales en el bulk. */
  hasErrors: boolean;
};

/**
 * Datagrid fijo de asignaciones por asignatura (CURSO-98 / CURSO-100).
 */
@Component({
  selector: 'app-course-assignments-grid',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './course-assignments-grid.component.html',
  styleUrl: './course-assignments-grid.component.scss',
})
export class CourseAssignmentsGridComponent implements OnInit {
  /** Bulk de asignaciones docentes por asignatura. */
  private readonly assignmentsService = inject(AssignmentsService);

  /** Profesores en los desplegables de la rejilla. */
  private readonly teachersService = inject(TeachersService);

  /** Grupos en los desplegables de la rejilla. */
  private readonly groupService = inject(GroupService);

  /** Navegación al builder de horarios tras guardar. */
  private readonly scheduleNav = inject(WeekScheduleNavigationService);

  /** Ciclo y grade para los que se editan asignaciones. */
  readonly context = input.required<CourseAssignmentsContext>();

  /** Vuelve al listado o wizard anterior. */
  readonly back = output<void>();

  /** Año escolar aplicado al guardado. */
  readonly schoolYear = signal(environment.currentSchoolYear);

  /** Carga inicial de asignaturas, profesores y grupos. */
  readonly loading = signal(true);

  /** Error al cargar datos de la rejilla. */
  readonly loadError = signal(false);

  /** Petición bulk en curso. */
  readonly saving = signal(false);

  /** Mensaje de resultado tras guardar. */
  readonly saveFeedback = signal<CourseAssignmentsSaveFeedback | null>(null);

  /** Validación cuando no hay filas completas para guardar. */
  readonly saveValidation = signal<'noneToSave' | null>(null);

  /** Asignaciones ya existentes en el ciclo/grade. */
  readonly existingAssignments = signal<AssignmentWithIncludes[]>([]);

  /** Filas editables del datagrid (una por asignatura). */
  readonly rows = signal<CourseAssignmentGridRow[]>([]);

  /** Profesores disponibles en los desplegables. */
  readonly teachers = signal<Teacher[]>([]);

  /** Grupos disponibles en los desplegables. */
  readonly groups = signal<Group[]>([]);

  /** Muestra aviso para crear plantilla horaria tras guardar. */
  readonly showSchedulePrompt = signal(false);

  /** Grupo usado en el último guardado exitoso (navegación a horarios). */
  private readonly lastSavedGroupId = signal<number | null>(null);

  /** Carga asignaturas, asignaciones existentes, profesores y grupos. */
  ngOnInit(): void {
    this.loadGrid();
  }

  /** Texto del grade para la cabecera (p. ej. `2º`). */
  gradeDisplay(): string {
    const grade = this.context().grade.trim();
    if (/^\d+$/.test(grade)) {
      return `${grade}º`;
    }
    return grade;
  }

  /** Nombre completo del profesor para el `<select>`. */
  teacherLabel(teacher: Teacher): string {
    return [teacher.name, teacher.surname, teacher.ndSurname].filter(Boolean).join(' ').trim();
  }

  /** Etiqueta del profesor en la tabla de asignaciones existentes. */
  assignmentTeacherLabel(a: AssignmentWithIncludes): string {
    const t = a.teacher;
    if (!t?.name) {
      return '—';
    }
    return [t.name, t.surname].filter(Boolean).join(' ').trim();
  }

  /** Actualiza el profesor seleccionado en una fila. */
  onTeacherChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    this.updateRow(row.idSubject, { idTeacher: id });
    this.clearSaveMessages();
  }

  /** Actualiza el grupo; la primera fila propaga el grupo a todas las filas. */
  onGroupChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    const isFirstRow = this.rows()[0]?.idSubject === row.idSubject;
    if (isFirstRow && id != null) {
      this.rows.update((list) => list.map((r) => ({ ...r, idGroup: id })));
    } else {
      this.updateRow(row.idSubject, { idGroup: id });
    }
    this.clearSaveMessages();
  }

  /** Envía en bulk las filas con profesor y grupo completos. */
  onSave(): void {
    this.clearSaveMessages();

    const completeRows = this.rows().filter((r) => this.isRowComplete(r));
    const incompleteCount = this.rows().filter((r) => this.isRowIncomplete(r)).length;

    if (completeRows.length === 0) {
      this.saveValidation.set('noneToSave');
      if (incompleteCount > 0) {
        this.saveFeedback.set({
          created: 0,
          duplicates: 0,
          incomplete: incompleteCount,
          hasErrors: false,
        });
      }
      return;
    }

    const payload: AssignmentBulkCreateItem[] = completeRows.map((r) => ({
      idTeacher: r.idTeacher!,
      idSubject: r.idSubject,
      idGroup: r.idGroup!,
      schoolYear: this.schoolYear(),
    }));

    const savedSubjectIds = new Set(completeRows.map((r) => r.idSubject));

    this.saving.set(true);
    this.assignmentsService.createAssignmentsBulk(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        const data = res.data ?? { created: 0, duplicates: 0, skipped: 0, errors: [] };
        this.saveFeedback.set({
          created: data.created,
          duplicates: data.duplicates,
          incomplete: incompleteCount,
          hasErrors: data.errors.length > 0 || !res.success,
        });

        if (data.created > 0) {
          this.lastSavedGroupId.set(completeRows[0]?.idGroup ?? null);
          this.showSchedulePrompt.set(true);
          this.clearRows(savedSubjectIds);
          this.refreshExistingAssignments();
        } else if (data.duplicates > 0) {
          this.refreshExistingAssignments();
        }
      },
      error: () => {
        this.saving.set(false);
        this.saveFeedback.set({
          created: 0,
          duplicates: 0,
          incomplete: incompleteCount,
          hasErrors: true,
        });
      },
    });
  }

  /** `true` si el último guardado creó filas sin errores. */
  feedbackIsSuccess(): boolean {
    const f = this.saveFeedback();
    return !!f && f.created > 0 && !f.hasErrors;
  }

  /** `true` si hubo duplicados o filas incompletas sin error fatal. */
  feedbackIsWarning(): boolean {
    const f = this.saveFeedback();
    return !!f && (f.duplicates > 0 || f.incomplete > 0) && !f.hasErrors;
  }

  /** Carga paralela de datos de la rejilla. */
  private loadGrid(): void {
    const ctx = this.context();
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      subjects: this.assignmentsService.getSubjectsByCourseAndGrade(ctx.idCourse, ctx.grade),
      existing: this.assignmentsService.getAssignmentsByCourseAndGrade(
        ctx.idCourse,
        ctx.grade,
        this.schoolYear(),
      ),
      teachers: this.teachersService.getAllTeachers(),
      groups: this.groupService.getAllGroups(),
    }).subscribe({
      next: ({ subjects, existing, teachers, groups }) => {
        this.loading.set(false);
        if (!subjects.success) {
          this.loadError.set(true);
          this.rows.set([]);
        } else {
          this.rows.set(
            subjects.data.map((s) => ({
              idSubject: s.id,
              subjectName: s.name,
              idTeacher: null,
              idGroup: null,
            })),
          );
        }
        this.existingAssignments.set(existing.success ? existing.data : []);
        this.teachers.set(teachers.success ? teachers.data : []);
        this.groups.set(groups.success ? groups.data : []);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  /** Recarga asignaciones existentes tras un guardado. */
  private refreshExistingAssignments(): void {
    const ctx = this.context();
    this.assignmentsService
      .getAssignmentsByCourseAndGrade(ctx.idCourse, ctx.grade, this.schoolYear())
      .subscribe((res) => {
        if (res.success) {
          this.existingAssignments.set(res.data);
        }
      });
  }

  /** Fila lista para incluirse en el payload bulk. */
  private isRowComplete(row: CourseAssignmentGridRow): boolean {
    return row.idTeacher != null && row.idGroup != null;
  }

  /** Solo profesor o solo grupo rellenado. */
  private isRowIncomplete(row: CourseAssignmentGridRow): boolean {
    const hasTeacher = row.idTeacher != null;
    const hasGroup = row.idGroup != null;
    return hasTeacher !== hasGroup;
  }

  /** Vacía profesor y grupo en filas ya guardadas. */
  private clearRows(subjectIds: Set<number>): void {
    this.rows.update((list) =>
      list.map((r) =>
        subjectIds.has(r.idSubject)
          ? { ...r, idTeacher: null, idGroup: null }
          : r,
      ),
    );
  }

  /** Oculta feedback y aviso de horario al editar de nuevo. */
  private clearSaveMessages(): void {
    this.saveFeedback.set(null);
    this.saveValidation.set(null);
    this.showSchedulePrompt.set(false);
  }

  /** Aplica un parche a una fila por `idSubject`. */
  private updateRow(
    idSubject: number,
    patch: Partial<Pick<CourseAssignmentGridRow, 'idTeacher' | 'idGroup'>>,
  ): void {
    this.rows.update((list) =>
      list.map((r) => (r.idSubject === idSubject ? { ...r, ...patch } : r)),
    );
  }

  /** Emite evento de retroceso al contenedor. */
  onBack(): void {
    this.back.emit();
  }

  /** Cierra el aviso de crear plantilla horaria. */
  dismissSchedulePrompt(): void {
    this.showSchedulePrompt.set(false);
  }

  /** Navega al builder de horarios con el grupo guardado. */
  goToCreateSchedule(): void {
    const idGroup = this.lastSavedGroupId();
    if (idGroup == null) {
      return;
    }
    const ctx = this.context();
    this.scheduleNav.goToCreateTemplate({
      idCourse: ctx.idCourse,
      grade: ctx.grade,
      idGroup,
    });
    this.showSchedulePrompt.set(false);
    this.back.emit();
  }
}
