import { computed, inject, Injectable, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationRepository } from '../../repository/notification-repository';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly repo = inject(NotificationRepository);
  private readonly _notifications = signal<Notification[]>([]);
  private loadSub: Subscription | null = null;

  readonly notifications = this._notifications.asReadonly();

  readonly unreadCount = computed(() =>
    this._notifications().filter((n) => !n.isRead).length
  );

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  /** Carga o refresca desde el API (llamar con sesión activa). */
  load(): void {
    this.loadSub?.unsubscribe();
    this.loadSub = this.repo.getAll().subscribe((data) => this._notifications.set(data));
  }

  markAsRead(id: number): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    this.repo.markAsRead(id).subscribe();
  }

  markAllAsRead(): void {
    const unreadIds = this._notifications().filter((n) => !n.isRead).map((n) => n.id);
    this._notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
    if (unreadIds.length > 0) {
      this.repo.markAllAsRead(unreadIds).subscribe();
    }
  }
}
