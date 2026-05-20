import { Component, inject, Input } from '@angular/core';
import { Validators } from '@angular/forms';
import { AppNotification } from '../../../../../core/services/notifications.service';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import {
  AdminNotificationService,
  NotificationDeleteResponse,
  NotificationUpdatePayload,
} from '../../../../../core/services/admin/entities/admin-notification.service';

@Component({
  selector: 'app-notification-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './notification-list-item.component.html',
  styleUrl: './notification-list-item.component.scss',
})
export class NotificationListItemComponent {
  private readonly notificationService = inject(AdminNotificationService);

  @Input({ required: true }) notification!: AppNotification;

  readonly notificationConfig: ListItemConfig<
    AppNotification,
    NotificationUpdatePayload,
    { success: boolean; data: AppNotification },
    NotificationDeleteResponse
  > = {
    fields: [
      { key: 'title', className: 'font-medium', order: 1 },
      {
        key: 'isRead',
        label: 'Leída',
        order: 2,
        format: (v: boolean) => (v ? 'Sí' : 'No'),
      },
      { key: 'type', label: 'Tipo', order: 3 },
    ],
    actions: { edit: true, delete: true, detail: true },
    layout: { responsive: false },
    editFields: [
      { name: 'title', label: 'Título', type: 'text', validators: [Validators.required] },
      { name: 'message', label: 'Mensaje', type: 'text' },
      {
        name: 'isRead',
        label: 'Marcar como leída',
        fieldType: 'select',
        options: [
          { value: true, label: 'Sí' },
          { value: false, label: 'No' },
        ],
      },
    ],
    entityType: 'la notificación',
    entityNameFormat: (n: AppNotification) => n.title,
    getByIdFn: (id: number) => this.notificationService.getById(id),
    updateFn: (data: NotificationUpdatePayload) => this.notificationService.update(data),
    deleteFn: (id: number) => this.notificationService.delete(id),
  };

  readonly notificationDetailConfig: ViewDetailConfig<AppNotification> = {
    fields: [
      { key: 'title', type: 'text', label: 'Título: ', className: 'text-xl font-bold' },
      { key: 'message', type: 'text', label: 'Mensaje: ' },
      { key: 'type', type: 'text', label: 'Tipo: ' },
      {
        key: 'isRead',
        type: 'text',
        label: 'Leída: ',
        format: (v: boolean) => (v ? 'Sí' : 'No'),
      },
      { key: 'recipientFirebaseUID', type: 'text', label: 'Destinatario (Firebase UID): ' },
      { key: 'createdAt', type: 'text', label: 'Creada: ' },
    ],
  };
}
