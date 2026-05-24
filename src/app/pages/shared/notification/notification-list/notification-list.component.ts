import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationListItemComponent } from '../notification-list-item/notification-list-item.component';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { NotificationToggleService } from '../../../../core/services/notification/notification-toggle.service';

/** Panel desplegable de notificaciones de la cabecera. */
@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [NotificationListItemComponent, TranslateModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent {
  /** Estado y acciones de la bandeja de notificaciones. */
  protected readonly service = inject(NotificationService);

  /** Controla el cierre del panel desde la propia lista. */
  protected readonly panelService = inject(NotificationToggleService);

  /** Marca como leída la notificación que el usuario acaba de abrir. */
  onItemClicked(id: number): void {
    this.service.markAsRead(id);
  }

  /** Marca como leídas todas las notificaciones visibles en la bandeja. */
  markAllAsRead(): void {
    this.service.markAllAsRead();
  }
}

