import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notification } from '../../models/notification';
import { NotificationRepository } from '../../repository/notification-repository';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly repo = inject(NotificationRepository);
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.isRead).length);
  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    // problema con cambio de sesion (posible solución)
    this.authService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        if (user) {
          this.load();
        } else {
          this._notifications.set([]);
        }
      });

    // suscribirse a los eventos  en tiempo real
    this.notificationsService.notification$
      .pipe(takeUntilDestroyed())
      .subscribe(newNotification => {
        this._notifications.update(list => {
          if (list.some(n => n.id === newNotification.id)) {
            return list;
          }
          return [newNotification, ...list];
        });
      });
  }

  load(): void {
    this.repo.getAll().subscribe({
      next: (list) => this._notifications.set(list),
      error: (err) => console.error('Error al cargar notificaciones', err)
    });
  }

  markAsRead(id: number): void {
    // Optimistic UI update
    this._notifications.update(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
    this.repo.markAsRead(id).subscribe({
      next: () => {
        void this.notificationsService.refreshUnreadCount();
      }
    });
  }

  markAllAsRead(): void {
    this._notifications.update(list => list.map(n => ({ ...n, isRead: true })));
    this.repo.markAllAsRead().subscribe({
      next: () => {
        void this.notificationsService.refreshUnreadCount();
      }
    });
  }
}
