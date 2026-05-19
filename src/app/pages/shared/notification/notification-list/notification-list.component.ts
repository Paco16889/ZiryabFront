import { Component, inject } from '@angular/core';
import { NotificationListItemComponent } from "../notification-list-item/notification-list-item.component";
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { NotificationToggleService } from '../../../../core/services/notification/notification-toggle.service';

@Component({
  selector: 'app-notification-list',
  imports: [NotificationListItemComponent],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent {
  protected readonly service      = inject(NotificationService);
  protected readonly panelService = inject(NotificationToggleService);

  onItemClicked(id: number): void {
    this.service.markAsRead(id);
  }

  markAllAsRead(): void {
    this.service.markAllAsRead();
  }
}

