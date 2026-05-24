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
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(AdminTaskService);
  private readonly assignmentHttp = inject(AssignmentHttpService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly taskCreated = output<void>();

  readonly taskTypes = Object.values(TaskType);
  readonly assignmentOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingAssignments = signal(true);

  createForm = this.fb.group({
    idTeacherAssignment: [null as number | null, Validators.required],
    title: ['', Validators.required],
    type: [TaskType.HOMEWORK, Validators.required],
    startDate: ['', Validators.required],
    dueDate: ['', Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    description: [''],
  });

  isCreating = false;
  errorMessage = '';

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

  typeLabel(type: TaskType): string {
    const labels: Record<TaskType, string> = {
      [TaskType.PRACTICE]: 'Práctica',
      [TaskType.THEORY]: 'Teoría',
      [TaskType.EXAM]: 'Examen',
      [TaskType.PROJECT]: 'Proyecto',
      [TaskType.HOMEWORK]: 'Deberes',
    };
    return labels[type];
  }

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

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
