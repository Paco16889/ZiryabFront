import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  Task,
  TaskDeleteResponse,
  TaskType,
  TaskUpdateResponse,
} from '../../../../../core/models/task';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import {
  AdminTaskService,
  TaskUpdatePayload,
} from '../../../../../core/services/admin/entities/task.service';

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  [TaskType.PRACTICE]: 'Práctica',
  [TaskType.THEORY]: 'Teoría',
  [TaskType.EXAM]: 'Examen',
  [TaskType.PROJECT]: 'Proyecto',
  [TaskType.HOMEWORK]: 'Deberes',
};

/**
 * Fila de tarea en el listado admin (patrón group-list-item, CURSO-103).
 */
@Component({
  selector: 'app-task-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  private readonly taskService = inject(AdminTaskService);

  @Input({ required: true }) task!: Task;

  readonly taskConfig: ListItemConfig<
    Task,
    TaskUpdatePayload,
    TaskUpdateResponse,
    TaskDeleteResponse
  > = {
    fields: [
      { key: 'title', className: 'font-medium', order: 1 },
      {
        key: 'type',
        order: 2,
        format: (value: TaskType) => TASK_TYPE_LABELS[value] ?? value,
      },
      {
        key: 'dueDate',
        label: 'Entrega',
        order: 3,
        format: (value: string) => (value ? value.split('T')[0] : '—'),
      },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        validators: [Validators.required],
        errorMessage: 'El título es obligatorio',
      },
      {
        name: 'type',
        label: 'Tipo',
        fieldType: 'select',
        validators: [Validators.required],
        options: Object.values(TaskType).map((t) => ({
          value: t,
          label: TASK_TYPE_LABELS[t],
        })),
      },
      {
        name: 'startDate',
        label: 'Inicio',
        type: 'date',
        validators: [Validators.required],
      },
      {
        name: 'dueDate',
        label: 'Entrega',
        type: 'date',
        validators: [Validators.required],
      },
      {
        name: 'description',
        label: 'Descripción',
        type: 'text',
      },
    ],
    entityType: 'la tarea',
    entityNameFormat: (t: Task) => t.title,
    getByIdFn: (id: number) => this.taskService.getTaskById(id),
    updateFn: (data: TaskUpdatePayload) => this.taskService.updateTask(data),
    deleteFn: (id: number) => this.taskService.deleteTask(id),
  };

  readonly taskDetailConfig: ViewDetailConfig<Task> = {
    fields: [
      { key: 'title', type: 'text', label: 'Título: ', className: 'text-xl font-bold' },
      {
        key: 'type',
        type: 'text',
        label: 'Tipo: ',
        format: (value: TaskType) => TASK_TYPE_LABELS[value] ?? String(value),
      },
      { key: 'startDate', type: 'text', label: 'Inicio: ' },
      { key: 'dueDate', type: 'text', label: 'Entrega: ' },
      { key: 'schoolYear', type: 'text', label: 'Año escolar: ' },
      { key: 'description', type: 'text', label: 'Descripción: ' },
    ],
  };
}
