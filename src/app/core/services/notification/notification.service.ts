import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  readonly unreadCount = computed(() =>
    this._notifications().filter((n) => !n.isRead).length
  );

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.load();
        } else {
          this._notifications.set([]);
        }
      });

    this.notificationsService.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load());
  }

  load(): void {
    this.repo.getAll().subscribe({
      next: (data) => this._notifications.set(data),
      error: (err) => console.error('Error al cargar notificaciones', err),
    });
  }

  markAsRead(id: number): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    this.repo.markAsRead(id).subscribe({
      next: () => {
        void this.notificationsService.refreshUnreadCount?.();
      },
    });
  }

  markAllAsRead(): void {
    const unreadIds = this._notifications().filter((n) => !n.isRead).map((n) => n.id);
    this._notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
    if (unreadIds.length > 0) {
      this.repo.markAllAsRead(unreadIds).subscribe({
        next: () => {
          void this.notificationsService.refreshUnreadCount?.();
        },
      });
    }
  }
}
