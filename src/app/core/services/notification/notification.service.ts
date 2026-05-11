import { computed, inject, Injectable, signal } from '@angular/core';
import { NotificationRepository } from '../../repository/notification-repository';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notification } from '../../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly repo = inject(NotificationRepository);
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();

  readonly unreadCount = computed(() =>
    this._notifications().filter(n => !n.isRead).length
  );

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    this.load();
  }

  load(): void {
    this.repo.getAll()
      .pipe(takeUntilDestroyed())
      .subscribe(data => this._notifications.set(data));
  }

  markAsRead(id: number): void {
    this._notifications.update(list =>
      list.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    this.repo.markAsRead(id).subscribe();
  }

  markAllAsRead(): void {
    this._notifications.update(list =>
      list.map(n => ({ ...n, isRead: true }))
    );
    this.repo.markAllAsRead().subscribe();
  }
}
