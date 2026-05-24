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
import { environment } from '../../../../../../environments/environment';

/** Resultado resumido del guardado masivo de asignaciones desde el grid. */
export type CourseAssignmentsSaveFeedback = {
  /** Asignaciones creadas correctamente. */
  created: number;

  /** Filas que ya existían en backend y no se duplicaron. */
  duplicates: number;

  /** Filas con profesor o grupo sin completar. */
  incomplete: number;

  /** Indica si el backend devolvió errores parciales o fallo general. */
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
  /** Servicio de asignaciones docentes y endpoints auxiliares de oferta. */
  private readonly assignmentsService = inject(AssignmentsService);

  /** Catálogo de profesores para seleccionar responsable de cada asignatura. */
  private readonly teachersService = inject(TeachersService);

  /** Catálogo de grupos para seleccionar dónde se imparte cada asignatura. */
  private readonly groupService = inject(GroupService);

  /** Contexto recibido desde el wizard: ciclo y grade que delimitan las asignaturas. */
  readonly context = input.required<CourseAssignmentsContext>();

  /** Vuelve al paso anterior del asistente. */
  readonly back = output<void>();

  /** Curso escolar aplicado al alta masiva. */
  readonly schoolYear = signal(environment.currentSchoolYear);

  /** Estado de carga inicial del grid. */
  readonly loading = signal(true);

  /** Error al cargar asignaturas, asignaciones existentes, profesores o grupos. */
  readonly loadError = signal(false);

  /** Estado de guardado masivo. */
  readonly saving = signal(false);

  /** Resumen de la última operación de guardado. */
  readonly saveFeedback = signal<CourseAssignmentsSaveFeedback | null>(null);

  /** Validación específica cuando no hay ninguna fila completa para guardar. */
  readonly saveValidation = signal<'noneToSave' | null>(null);

  /** Asignaciones ya existentes para mostrar duplicados o evitar confusión. */
  readonly existingAssignments = signal<AssignmentWithIncludes[]>([]);

  /** Filas editables, una por asignatura ofertada en el ciclo/grade. */
  readonly rows = signal<CourseAssignmentGridRow[]>([]);

  /** Profesores disponibles para el selector de cada fila. */
  readonly teachers = signal<Teacher[]>([]);

  /** Grupos disponibles para el selector de cada fila. */
  readonly groups = signal<Group[]>([]);

  /** Carga catálogos y filas al iniciar el grid. */
  ngOnInit(): void {
    this.loadGrid();
  }

  /** Formatea `grade` numérico como ordinal para mostrarlo en la cabecera. */
  gradeDisplay(): string {
    const grade = this.context().grade.trim();
    if (/^\d+$/.test(grade)) {
      return `${grade}º`;
    }
    return grade;
  }

  /** Nombre completo del profesor para opciones de selector. */
  teacherLabel(teacher: Teacher): string {
    return [teacher.name, teacher.surname, teacher.ndSurname].filter(Boolean).join(' ').trim();
  }

  /** Nombre del profesor en asignaciones ya persistidas. */
  assignmentTeacherLabel(a: AssignmentWithIncludes): string {
    const t = a.teacher;
    if (!t?.name) {
      return '—';
    }
    return [t.name, t.surname].filter(Boolean).join(' ').trim();
  }

  /** Actualiza el profesor elegido en una fila y limpia mensajes previos. */
  onTeacherChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    this.updateRow(row.idSubject, { idTeacher: id });
    this.clearSaveMessages();
  }

  /** Actualiza el grupo elegido en una fila y limpia mensajes previos. */
  onGroupChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    this.updateRow(row.idSubject, { idGroup: id });
    this.clearSaveMessages();
  }

  /** Valida filas completas y ejecuta el alta masiva de asignaciones. */
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

  /** Indica si el último guardado creó asignaciones sin errores. */
  feedbackIsSuccess(): boolean {
    const f = this.saveFeedback();
    return !!f && f.created > 0 && !f.hasErrors;
  }

  /** Indica si el último guardado acabó con duplicados o filas incompletas no críticas. */
  feedbackIsWarning(): boolean {
    const f = this.saveFeedback();
    return !!f && (f.duplicates > 0 || f.incomplete > 0) && !f.hasErrors;
  }

  /** Carga asignaturas del grade, asignaciones existentes, profesores y grupos. */
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

  /** Recarga solo las asignaciones existentes después de guardar. */
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

  /** Una fila se puede guardar cuando tiene profesor y grupo. */
  private isRowComplete(row: CourseAssignmentGridRow): boolean {
    return row.idTeacher != null && row.idGroup != null;
  }

  /** Detecta filas parcialmente rellenadas para informar al usuario. */
  private isRowIncomplete(row: CourseAssignmentGridRow): boolean {
    const hasTeacher = row.idTeacher != null;
    const hasGroup = row.idGroup != null;
    return hasTeacher !== hasGroup;
  }

  /** Limpia profesor/grupo de asignaturas que ya se intentaron guardar. */
  private clearRows(subjectIds: Set<number>): void {
    this.rows.update((list) =>
      list.map((r) =>
        subjectIds.has(r.idSubject)
          ? { ...r, idTeacher: null, idGroup: null }
          : r,
      ),
    );
  }

  /** Borra mensajes de validación/feedback antes de una nueva edición. */
  private clearSaveMessages(): void {
    this.saveFeedback.set(null);
    this.saveValidation.set(null);
  }

  /** Aplica cambios inmutables a una fila identificada por asignatura. */
  private updateRow(
    idSubject: number,
    patch: Partial<Pick<CourseAssignmentGridRow, 'idTeacher' | 'idGroup'>>,
  ): void {
    this.rows.update((list) =>
      list.map((r) => (r.idSubject === idSubject ? { ...r, ...patch } : r)),
    );
  }

  /** Vuelve al wizard sin guardar cambios pendientes. */
  onBack(): void {
    this.back.emit();
  }
}
