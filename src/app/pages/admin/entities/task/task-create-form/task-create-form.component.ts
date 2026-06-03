import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { TaskType } from '../../../../../core/models/task';
import { AssignmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/teacher-assignment-http.service';
import { AdminTaskService } from '../../../../../core/services/admin/entities/task.service';
import { environment } from '../../../../../../environments/environment';

/**
 * Formulario de alta de tarea (patrón group-create-form, CURSO-103).
 */
@Component({
  selector: 'app-task-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './task-create-form.component.html',
  styleUrl: './task-create-form.component.scss',
})
export class TaskCreateFormComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio CRUD admin de tareas. */
  private readonly taskService = inject(AdminTaskService);
  /** Servicio de asignaciones para elegir profesor-asignatura-grupo. */
  private readonly assignmentHttp = inject(AssignmentHttpService);
  /** Traducciones de errores del backend. */
  private readonly translate = inject(TranslateService);

  /** Cancela la creación y vuelve al listado. */
  readonly cancelCreate = output<void>();
  /** Notifica al listado que debe recargar tras crear. */
  readonly taskCreated = output<void>();

  /** Tipos de tarea disponibles en el dominio. */
  readonly taskTypes = Object.values(TaskType);
  /** Opciones de asignación docente para asociar la tarea. */
  readonly assignmentOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Estado de carga de asignaciones. */
  readonly loadingAssignments = signal(true);

  /** Formulario de alta de tarea. */
  createForm = this.fb.group({
    idTeacherAssignment: [null as number | null, Validators.required],
    title: ['', Validators.required],
    type: [TaskType.HOMEWORK, Validators.required],
    startDate: ['', Validators.required],
    dueDate: ['', Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    description: [''],
  });

  /** Evita doble envío durante la creación. */
  isCreating = false;
  /** Error traducido mostrado en el formulario. */
  errorMessage = '';

  /** Carga asignaciones docentes disponibles para asociar la tarea. */
  ngOnInit(): void {
    this.assignmentHttp.getAll().subscribe((res) => {
      this.loadingAssignments.set(false);
      if (!res.success) {
        this.assignmentOptions.set([]);
        return;
      }
      this.assignmentOptions.set(
        res.data.map((a) => {
          const teacher = [a.teacher?.name, a.teacher?.surname].filter(Boolean).join(' ');
          const subject = a.subject?.name ?? '—';
          const group = a.group?.name ?? '—';
          return {
            value: a.id,
            label: `${teacher} · ${subject} · ${group}`,
          };
        }),
      );
    });
  }

  /** Etiqueta humana del enum de tipo de tarea. */
  typeLabel(type: TaskType): string {
    const labels: Record<TaskType, string> = {
      [TaskType.PRACTICE]: this.translate.instant('teacherPages.taskTypes.practice'),
      [TaskType.THEORY]: this.translate.instant('teacherPages.taskTypes.theory'),
      [TaskType.EXAM]: this.translate.instant('teacherPages.taskTypes.exam'),
      [TaskType.PROJECT]: this.translate.instant('teacherPages.taskTypes.project'),
      [TaskType.HOMEWORK]: this.translate.instant('teacherPages.taskTypes.homework'),
    };
    return labels[type];
  }

  /** Valida y crea la tarea administrativa. */
  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const raw = this.createForm.getRawValue();
    this.isCreating = true;
    this.errorMessage = '';

    this.taskService
      .createTask({
        idTeacherAssignment: raw.idTeacherAssignment as number,
        title: (raw.title as string).trim(),
        type: raw.type as TaskType,
        startDate: raw.startDate as string,
        dueDate: raw.dueDate as string,
        schoolYear: (raw.schoolYear as string).trim(),
        description: raw.description?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.taskCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createTask');
        },
      });
  }

  /** Cancela el formulario sin crear tarea. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
