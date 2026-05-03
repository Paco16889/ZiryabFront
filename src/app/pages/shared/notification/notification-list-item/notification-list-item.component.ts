import { Component, input, output } from '@angular/core';
import { Notification, NotificationEntityType } from '../../../../core/models/notification';
import { NotificationAction } from '../../../../core/models/notification';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-notification-list-item',
  imports: [DatePipe],
  templateUrl: './notification-list-item.component.html',
  styleUrl: './notification-list-item.component.scss'
})
export class NotificationListItemComponent {
    notification = input.required<Notification>();
    
  notificationClick = output<{ entityId: number; entityType: NotificationEntityType }>();

  protected onItemClick(): void {
    const { entityId, entityType } = this.notification();
    this.notificationClick.emit({ entityId, entityType });
  }
}
