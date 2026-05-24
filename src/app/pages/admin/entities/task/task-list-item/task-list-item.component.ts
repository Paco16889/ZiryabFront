import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
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
  private readonly translate = inject(TranslateService);

  @Input({ required: true }) task!: Task;

  private taskTypeLabel(type: TaskType): string {
    return this.translate.instant('taskTypes.' + type);
  }

  get taskConfig(): ListItemConfig<
    Task,
    TaskUpdatePayload,
    TaskUpdateResponse,
    TaskDeleteResponse
  > {
    return {
      fields: [
        { key: 'title', className: 'font-medium', order: 1 },
        {
          key: 'type',
          order: 2,
          format: (value: TaskType) => this.taskTypeLabel(value) ?? value,
        },
        {
          key: 'dueDate',
          label: this.translate.instant('lists.tasks.fields.dueDate'),
          order: 3,
          format: (value: string) => (value ? value.split('T')[0] : '—'),
        },
      ],
      actions: { edit: true, delete: true, detail: true },
      layout: { responsive: false },
      editFields: [
        {
          name: 'title',
          label: this.translate.instant('lists.tasks.fields.title'),
          type: 'text',
          validators: [Validators.required],
          errorMessage: this.translate.instant('lists.tasks.validation.title'),
        },
        {
          name: 'type',
          label: this.translate.instant('lists.tasks.fields.type'),
          fieldType: 'select',
          validators: [Validators.required],
          options: Object.values(TaskType).map((t) => ({
            value: t,
            label: this.taskTypeLabel(t),
          })),
        },
        {
          name: 'startDate',
          label: this.translate.instant('lists.tasks.fields.startDate'),
          type: 'date',
          validators: [Validators.required],
        },
        {
          name: 'dueDate',
          label: this.translate.instant('lists.tasks.fields.dueDate'),
          type: 'date',
          validators: [Validators.required],
        },
        {
          name: 'description',
          label: this.translate.instant('lists.tasks.fields.description'),
          type: 'text',
        },
      ],
      entityType: this.translate.instant('entities.task.singularArticle'),
      entityNameFormat: (t: Task) => t.title,
      getByIdFn: (id: number) => this.taskService.getTaskById(id),
      updateFn: (data: TaskUpdatePayload) => this.taskService.updateTask(data),
      deleteFn: (id: number) => this.taskService.deleteTask(id),
    };
  }

  get taskDetailConfig(): ViewDetailConfig<Task> {
    return {
      fields: [
        {
          key: 'title',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.title') + ': ',
          className: 'text-xl font-bold',
        },
        {
          key: 'type',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.type') + ': ',
          format: (value: TaskType) => this.taskTypeLabel(value) ?? String(value),
        },
        {
          key: 'startDate',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.startDate') + ': ',
        },
        {
          key: 'dueDate',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.dueDate') + ': ',
        },
        {
          key: 'schoolYear',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.schoolYear') + ': ',
        },
        {
          key: 'description',
          type: 'text',
          label: this.translate.instant('lists.tasks.fields.description') + ': ',
        },
      ],
    };
  }
}
