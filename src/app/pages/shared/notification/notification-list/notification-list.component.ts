import { Component, inject } from '@angular/core';
import { NotificationListItemComponent } from "../notification-list-item/notification-list-item.component";
import { NotificationServiceService } from '../../../../core/services/notification/notification-service.service';
import { NotificationToggleServiceService } from '../../../../core/services/notification/notification-toggle-service.service';
import { NotificationEntityType } from '../../../../core/models/notification';

@Component({
  selector: 'app-notification-list',
  imports: [NotificationListItemComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent {
  protected readonly service      = inject(NotificationServiceService);
  protected readonly panelService = inject(NotificationToggleServiceService);

 onItemClicked(event: { entityId: number; entityType: NotificationEntityType }): void {
  this.service.markAsRead(event.entityId);
}
  markAllAsRead(): void {
    this.service.markAllAsRead();
  }
}
