import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Subscription, distinctUntilChanged, firstValueFrom, map } from 'rxjs';
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

/** Respuesta de `GET …/notifications` usada solo en este cliente. */
interface NotificationsListResponse {
  /** Mensaje informativo del backend. */
  message: string;

  /** Notificaciones de la página solicitada. */
  data: AppNotification[];

  /** Metadatos de paginación para el listado REST. */
  pagination: {
    /** Página solicitada. */
    page: number;
    /** Tamaño máximo de página. */
    limit: number;
    /** Total de notificaciones del usuario. */
    total: number;
    /** Número total de páginas. */
    totalPages: number;
  };
}

/**
 * Servicio de notificaciones del cliente.
 *
 * Combina REST (`GET /notifications`) para el número de no leídas inicial y
 * **Server-Sent Events** contra `/notifications/events` para recibir cada nueva
 * `AppNotification` en tiempo real usando cookies (`withCredentials` en `EventSource`).
 *
 * Se suscribe a {@link AuthService.currentUser$} para conectar SSE al iniciar sesión
 * y desconectar al cerrar sesión.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsService implements OnDestroy {
  /** Cliente HTTP usado para calcular el contador inicial de no leídas. */
  private readonly http = inject(HttpClient);

  /** Servicio de sesión que indica cuándo abrir o cerrar SSE. */
  private readonly authService = inject(AuthService);

  /** URL base del backend usada para REST y SSE. */
  private readonly apiUrl = environment.apiUrl;

  /** Instancia `EventSource` abierta hacia la API, o `null` si no hay conexión. */
  private eventSource: EventSource | null = null;

  /** Emisor de cada notificación parseada desde el stream SSE (`message`). */
  private readonly notificationSubject = new Subject<AppNotification>();

  /**
   * Flujo observable de nuevas notificaciones recibidas por SSE tras el login.
   */
  readonly notification$ = this.notificationSubject.asObservable();

  /** Estado del conteo de no leídas sincronizado con la API localmente. */
  private readonly unreadCountSubject = new BehaviorSubject<number>(0);

  /**
   * Flujo observable del número total de notificaciones no leídas.
   */
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  /** Suscripción al estado de sesión; se cancela en {@link NotificationsService.ngOnDestroy}. */
  private readonly authSubscription: Subscription;

  /**
   * Al construir el servicio, escucha cambios de usuario y abre/cierra SSE según haya Firebase UID estable.
   */
  constructor() {
    this.authSubscription = this.authService.currentUser$
      .pipe(
        map((user: UserResponse | null) => user?.firebaseUID ?? ''),
        distinctUntilChanged()
      )
      .subscribe((firebaseUid: string) => {
        if (!firebaseUid) {
          this.onLogout();
          return;
        }
        void this.onSessionActive();
      });
  }

  /**
   * Cierra SSE y cancela la suscripción al {@link AuthService}.
   */
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.disconnect();
  }

  /**
   * Tras autenticación: obtiene el contador de no leídas vía REST y abre el canal SSE.
   */
  private async onSessionActive(): Promise<void> {
    await this.refreshUnreadCount();
    this.connect();
  }

  /**
   * Limpia conexiones y reinicia el contador de no leídas al cerrar sesión.
   */
  private onLogout(): void {
    this.disconnect();
    this.unreadCountSubject.next(0);
  }

  /**
   * Establece conexión SSE con `GET …/notifications/events`.
   *
   * El navegador envía cookies de sesión gracias a `{ withCredentials: true }`,
   * coherente con el interceptor HTTP de la aplicación.
   */
  connect(): void {
    this.disconnect();

    const url = `${this.apiUrl}/notifications/events`;

    try {
      const es = new EventSource(url, { withCredentials: true });
      this.eventSource = es;

      es.addEventListener('message', (ev: MessageEvent) => {
        try {
          const raw = ev.data as string;
          const parsed = JSON.parse(raw) as AppNotification;
          this.notificationSubject.next(parsed);
          const nextUnread = Math.min(
            this.unreadCountSubject.value + 1,
            9999
          );
          this.unreadCountSubject.next(nextUnread);
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

  /**
   * Cierra el `EventSource` activo si existe.
   */
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  /**
   * Recalcula el número de notificaciones no leídas desde la API (página 1, límite fijo).
   */
  async refreshUnreadCount(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<NotificationsListResponse>(
          `${this.apiUrl}/notifications`,
          {
            params: { page: '1', limit: '500' },
          }
        )
      );
      const unread = res.data.filter((n: AppNotification) => !n.isRead).length;
      this.unreadCountSubject.next(unread);
    } catch {
      this.unreadCountSubject.next(0);
    }
  }
}
