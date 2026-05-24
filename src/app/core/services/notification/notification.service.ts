import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Notification } from '../../models/notification';
import { NotificationRepository } from '../../repository/notification-repository';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications.service';

/**
 * Estado de la bandeja de notificaciones mostrada en la cabecera.
 *
 * Se alimenta del repositorio REST para listar/marcar como leído y escucha
 * `NotificationsService.notification$` para refrescarse cuando llega un evento SSE.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /** Repositorio REST de notificaciones. */
  private readonly repo = inject(NotificationRepository);

  /** Servicio de sesión para limpiar la bandeja al cerrar sesión. */
  private readonly authService = inject(AuthService);

  /** Servicio SSE que emite nuevas notificaciones en tiempo real. */
  private readonly notificationsService = inject(NotificationsService);

  /** Ciclo de vida del servicio para cancelar suscripciones internas. */
  private readonly destroyRef = inject(DestroyRef);

  /** Lista mutable interna de notificaciones del panel. */
  private readonly _notifications = signal<Notification[]>([]);

  /** Lista pública de notificaciones para componentes de cabecera/listado. */
  readonly notifications = this._notifications.asReadonly();

  /** Número de notificaciones pendientes de lectura. */
  readonly unreadCount = computed(() =>
    this._notifications().filter((n) => !n.isRead).length
  );

  /** Indica si debe mostrarse la insignia de no leídas. */
  readonly hasUnread = computed(() => this.unreadCount() > 0);

  /** Sincroniza la bandeja con login/logout y con eventos SSE entrantes. */
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

  /** Recarga la bandeja completa desde el repositorio. */
  load(): void {
    this.repo.getAll().subscribe({
      next: (data) => this._notifications.set(data),
      error: (err) => console.error('Error al cargar notificaciones', err),
    });
  }

  /** Marca una notificación como leída de forma optimista y sincroniza el contador global. */
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

  /** Marca todas las notificaciones actuales como leídas de forma optimista. */
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
