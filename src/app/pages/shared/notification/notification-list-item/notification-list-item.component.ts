import { Component, input, output } from '@angular/core';
import { Notification } from '../../../../core/models/notification';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-list-item',
  standalone: true,
  imports: [DatePipe, TranslateModule],
  templateUrl: './notification-list-item.component.html',
  styleUrl: './notification-list-item.component.scss',
})
export class NotificationListItemComponent {
  notification = input.required<Notification>();

  /** Id de la notificación (para marcar leída en API). */
  notificationClick = output<number>();

  protected onItemClick(): void {
    this.notificationClick.emit(this.notification().id);
  }

  protected isTranslationKey(value: string | undefined): boolean {
    return typeof value === 'string' && value.includes('.');
  }
}

