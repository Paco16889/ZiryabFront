import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification';

/** Respuesta de `GET /api/notifications` (misma forma que usa `NotificationsService`). */
interface NotificationsListResponse {
  /** Mensaje informativo del backend. */
  message: string;

  /** Página de notificaciones devuelta por la API. */
  data: ApiNotification[];

  /** Metadatos de paginación cuando el backend los incluye. */
  pagination?: {
    /** Página solicitada. */
    page: number;
    /** Tamaño de página aplicado. */
    limit: number;
    /** Total de notificaciones del usuario. */
    total: number;
    /** Número total de páginas disponibles. */
    totalPages: number;
  };
}

/** Forma JSON exacta que devuelve el backend antes de mapearla al modelo de UI. */
interface ApiNotification {
  /** Identificador único de la notificación. */
  id: number;

  /** UID de Firebase del destinatario. */
  recipientFirebaseUID: string;

  /** Título o clave i18n. */
  title: string;

  /** Mensaje o clave i18n. */
  message: string;

  /** Tipo de notificación enviado por backend. */
  type: string;

  /** Estado de lectura actual. */
  isRead: boolean;

  /** Fecha de lectura serializada, o `null`. */
  readAt: string | null;

  /** Fecha de creación serializada. */
  createdAt: string;
}

/** Adapta la notificación REST al modelo común usado por el panel. */
function mapApiToNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    recipientFirebaseUID: n.recipientFirebaseUID,
    title: n.title,
    message: n.message,
    type: n.type,
    isRead: n.isRead,
    readAt: n.readAt,
    createdAt: n.createdAt,
  };
}

/** Repositorio REST de notificaciones, con modo mock para desarrollo local. */
@Injectable({ providedIn: 'root' })
export class NotificationRepository {
  /** Cliente HTTP usado para consultar y marcar notificaciones. */
  private readonly http = inject(HttpClient);

  /** URL base del backend configurada para la aplicación. */
  private readonly apiUrl = environment.apiUrl;

  /** Obtiene las últimas notificaciones del usuario autenticado. */
  getAll(): Observable<Notification[]> {
    if (environment.useMockNotifications) {
      return of(MOCK_NOTIFICATIONS.map((notification) => ({ ...notification })));
    }

    return this.http
      .get<NotificationsListResponse>(`${this.apiUrl}/notifications`, {
        params: { page: '1', limit: '500' },
      })
      .pipe(
        map((res) => (res.data ?? []).map(mapApiToNotification)),
        catchError(() => of([]))
      );
  }

  /** Marca una notificación como leída en backend, ignorando errores para no romper la UI. */
  markAsRead(id: number): Observable<void> {
    if (environment.useMockNotifications) {
      return of(undefined);
    }

    return this.http.patch(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }

  /** Marca varias como leídas ejecutando llamadas individuales porque no hay endpoint bulk. */
  markAllAsRead(ids: number[]): Observable<void> {
    if (ids.length === 0) {
      return of(undefined);
    }

    if (environment.useMockNotifications) {
      return of(undefined);
    }

    return forkJoin(ids.map((id) => this.markAsRead(id))).pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }
}

/** Datos locales para validar la UI de notificaciones sin depender del backend. */
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    recipientFirebaseUID: 'mock-student',
    title: 'notifications.mock.taskAssigned.title',
    message: 'notifications.mock.taskAssigned.message',
    type: 'TASK',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    recipientFirebaseUID: 'mock-student',
    title: 'notifications.mock.dueSoon.title',
    message: 'notifications.mock.dueSoon.message',
    type: 'TASK',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];
