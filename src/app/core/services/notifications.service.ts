import { computed, DestroyRef, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  Observable,
  of,
  Subject,
  Subscription,
  distinctUntilChanged,
  firstValueFrom,
  map,
} from 'rxjs';
import { AuthService, type UserResponse } from './auth.service';
import { environment } from '../../../environments/environment';

/**
 * Notificación según modelo del backend (`Notification` en Prisma).
 * Se recibe por SSE y en listados REST; las fechas en JSON vienen como cadena ISO.
 */
export interface AppNotification {
  /** Identificador único de la notificación. */
  id: number;

  /** UID de Firebase del destinatario. */
  recipientFirebaseUID: string;

  /** Título o clave i18n. */
  title: string;

  /** Mensaje o clave i18n. */
  message: string;

  /** Categoría de la notificación. */
  type: string;

  /** Indica si la notificación ya fue leída. */
  isRead: boolean;

  /** Fecha de lectura serializada o `null`. */
  readAt: string | null;

  /** Fecha de creación serializada. */
  createdAt: string;
}

/** Respuesta de `GET /api/notifications` y `GET /api/notifications/all`. */
export interface NotificationsListResponse {
  message: string;
  data: AppNotification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Cliente único de notificaciones: REST (`/api/notifications`), SSE (`/events`)
 * y estado de la bandeja de la cabecera.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly apiUrl = environment.apiUrl;

  private eventSource: EventSource | null = null;
  private readonly notificationSubject = new Subject<AppNotification>();
  readonly notification$ = this.notificationSubject.asObservable();

  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  private readonly authSubscription: Subscription;

  private readonly _notifications = signal<AppNotification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  readonly unreadCount = computed(
    () => this._notifications().filter((n) => !n.isRead).length,
  );

  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    this.authSubscription = this.authService.currentUser$
      .pipe(
        map((user: UserResponse | null) => user?.firebaseUID ?? ''),
        distinctUntilChanged(),
      )
      .subscribe((firebaseUid: string) => {
        if (!firebaseUid) {
          this.onLogout();
          return;
        }
        void this.onSessionActive();
      });

    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        if (user) {
          this.load();
        } else {
          this._notifications.set([]);
        }
      });

    this.notification$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.disconnect();
  }

  /** `GET /api/notifications/all` — listado admin. */
  getNotificationsList(): Observable<NotificationsListResponse> {
    return this.http
      .get<NotificationsListResponse>(`${this.apiUrl}/notifications/all`)
      .pipe(catchError(() => of({ message: '', data: [] })));
  }

  /** `GET /api/notifications` — bandeja del usuario autenticado. */
  getAll(): Observable<AppNotification[]> {
    return this.http
      .get<NotificationsListResponse>(`${this.apiUrl}/notifications`, {
        params: { page: '1', limit: '500' },
      })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      );
  }

  /** Recarga la bandeja de la cabecera desde el backend. */
  load(): void {
    this.getAll().subscribe({
      next: (data) => {
        this._notifications.set(data);
        this.unreadCountSubject.next(data.filter((n) => !n.isRead).length);
      },
      error: (err) => console.error('Error al cargar notificaciones', err),
    });
  }

  /** `PATCH /api/notifications/:id/read` */
  markAsRead(id: number): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    this.syncUnreadCountFromList();

    this.http.patch(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
    ).subscribe({
      next: () => void this.refreshUnreadCount(),
    });
  }

  /** Marca todas las visibles como leídas (una petición por id; no hay bulk en API). */
  markAllAsRead(): void {
    const unreadIds = this._notifications().filter((n) => !n.isRead).map((n) => n.id);
    this._notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
    this.syncUnreadCountFromList();

    if (unreadIds.length === 0) {
      return;
    }

    forkJoin(
      unreadIds.map((id) =>
        this.http.patch(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
          map(() => undefined),
          catchError(() => of(undefined)),
        ),
      ),
    ).subscribe({
      next: () => void this.refreshUnreadCount(),
    });
  }

  private async onSessionActive(): Promise<void> {
    await this.refreshUnreadCount();
    this.connect();
  }

  private onLogout(): void {
    this.disconnect();
    this.unreadCountSubject.next(0);
    this._notifications.set([]);
  }

  connect(): void {
    this.disconnect();

    const token = this.authService.getToken();
    const baseUrl = `${this.apiUrl}/notifications/events`;
    const url = token
      ? `${baseUrl}?token=${encodeURIComponent(token)}`
      : baseUrl;

    try {
      const es = new EventSource(url, { withCredentials: true });
      this.eventSource = es;

      es.addEventListener('message', (ev: MessageEvent) => {
        try {
          const parsed = JSON.parse(ev.data as string) as AppNotification;
          this.notificationSubject.next(parsed);
        } catch {
          // payload no JSON válido
        }
      });

      es.onerror = (): void => {
        if (es.readyState === EventSource.CLOSED) {
          this.eventSource = null;
        }
      };
    } catch {
      this.eventSource = null;
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  async refreshUnreadCount(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<NotificationsListResponse>(`${this.apiUrl}/notifications`, {
          params: { page: '1', limit: '500' },
        }),
      );
      const unread = (res.data ?? []).filter((n) => !n.isRead).length;
      this.unreadCountSubject.next(unread);
    } catch {
      this.unreadCountSubject.next(0);
    }
  }

  private syncUnreadCountFromList(): void {
    this.unreadCountSubject.next(
      this._notifications().filter((n) => !n.isRead).length,
    );
  }
}
