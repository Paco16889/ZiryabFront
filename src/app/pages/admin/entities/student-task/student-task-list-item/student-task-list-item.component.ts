import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  StudentTask,
  StudentTaskDeleteResponse,
  SubmissionStatus,
  StudentTaskUpdateResponse,
} from '../../../../../core/models/studentTask';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import {
  StudentTaskService,
  StudentTaskUpdatePayload,
} from '../../../../../core/services/admin/entities/student-task.service';

const STATUS_LABELS: Record<SubmissionStatus, string> = {
  [SubmissionStatus.PENDING]: 'Pendiente',
  [SubmissionStatus.SUBMITTED]: 'Entregada',
  [SubmissionStatus.LATE]: 'Tarde',
  [SubmissionStatus.GRADED]: 'Calificada',
  [SubmissionStatus.NOT_SUBMITTED]: 'No entregada',
};

@Component({
  selector: 'app-student-task-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './student-task-list-item.component.html',
  styleUrl: './student-task-list-item.component.scss',
})
export class StudentTaskListItemComponent {
  private readonly studentTaskService = inject(StudentTaskService);

  @Input({ required: true }) studentTask!: StudentTask;

  readonly studentTaskConfig: ListItemConfig<
    StudentTask,
    StudentTaskUpdatePayload,
    StudentTaskUpdateResponse,
    StudentTaskDeleteResponse
  > = {
    fields: [
      {
        key: 'task',
        label: 'Tarea',
        order: 1,
        format: (t: { title?: string }) => t?.title ?? '—',
      },
      {
        key: 'studentEnrollment',
        label: 'Alumno',
        order: 2,
        format: (e: { student?: { name?: string; surname?: string } }) => {
          if (!e?.student) return '—';
          return [e.student.name, e.student.surname].filter(Boolean).join(' ');
        },
      },
      {
        key: 'status',
        order: 3,
        format: (s: SubmissionStatus) => STATUS_LABELS[s] ?? s,
      },
      { key: 'score', label: 'Nota', order: 4, format: (v) => (v != null ? String(v) : '—') },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      {
        name: 'status',
        label: 'Estado',
        fieldType: 'select',
        validators: [Validators.required],
        options: Object.values(SubmissionStatus).map((s) => ({
          value: s,
          label: STATUS_LABELS[s],
        })),
      },
      { name: 'score', label: 'Nota', type: 'number' },
      { name: 'feedback', label: 'Feedback', type: 'text' },
    ],
    entityType: 'la entrega',
    entityNameFormat: (st: StudentTask) => st.task?.title ?? `Entrega ${st.id}`,
    getByIdFn: (id: number) => this.studentTaskService.getStudentTaskById(id),
    updateFn: (data: StudentTaskUpdatePayload) => this.studentTaskService.updateStudentTask(data),
    deleteFn: (id: number) => this.studentTaskService.deleteStudentTask(id),
  };

  readonly studentTaskDetailConfig: ViewDetailConfig<StudentTask> = {
    fields: [
      { key: 'task.title', type: 'text', label: 'Tarea: ', className: 'text-xl font-bold' },
      {
        key: 'status',
        type: 'text',
        label: 'Estado: ',
        format: (s: SubmissionStatus) => STATUS_LABELS[s] ?? String(s),
      },
      { key: 'score', type: 'text', label: 'Nota: ' },
      { key: 'feedback', type: 'text', label: 'Feedback: ' },
      { key: 'submissionDate', type: 'text', label: 'Entrega: ' },
    ],
  };
}
