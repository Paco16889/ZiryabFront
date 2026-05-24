import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AppNotification } from '../../notifications.service';

/** Respuesta paginada del endpoint admin de notificaciones. */
interface NotificationsListResponse {
  /** Mensaje informativo del backend. */
  message: string;

  /** Notificaciones devueltas para la página solicitada. */
  data: AppNotification[];

  /** Total disponible cuando el backend añade paginación. */
  pagination?: { total: number };
}

/** Contrato `POST /api/notifications` (CURSO-108 / API actual). */
export interface NotificationCreateRequest {
  /** UID de Firebase del alumno o profesor destinatario. */
  recipientFirebaseUID: string;

  /** Título o clave i18n que verá el usuario. */
  title: string;

  /** Mensaje o clave i18n que verá el usuario. */
  message: string;

  /** Tipo funcional de notificación; por defecto se envía `SYSTEM`. */
  type?: string;
}

/** Campos editables por administración sobre una notificación existente. */
export interface NotificationUpdatePayload {
  /** Identificador de la notificación que se va a actualizar. */
  id: number;

  /** Permite marcar como leída desde el modal genérico. */
  isRead?: boolean;

  /** Nuevo título visible. */
  title?: string;

  /** Nuevo mensaje visible. */
  message?: string;
}

/** Respuesta de eliminación de una notificación. */
export interface NotificationDeleteResponse {
  /** Indica si el borrado se completó correctamente. */
  success: boolean;

  /** Mensaje de confirmación del backend. */
  message: string;

  /** Identificador eliminado. */
  deletedId: number;
}

/**
 * CRUD admin de notificaciones (`/api/notifications`). CURSO-108.
 */
@Injectable({ providedIn: 'root' })
export class AdminNotificationService {
  /** Cliente HTTP para el CRUD administrativo de notificaciones. */
  private readonly http = inject(HttpClient);

  /** Endpoint base del módulo de notificaciones. */
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  /** Cache reactiva del listado que consume la pantalla admin. */
  readonly notifications = signal<AppNotification[]>([]);

  /** Carga el listado y actualiza la cache local. */
  loadNotifications(): void {
    this.getAll().subscribe((list) => this.notifications.set(list));
  }

  /** Obtiene una página amplia de notificaciones para administración. */
  getAll(): Observable<AppNotification[]> {
    return this.http
      .get<NotificationsListResponse>(this.apiUrl, {
        params: { page: '1', limit: '500' },
      })
      .pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      );
  }

  /** Recupera una notificación por id para alimentar el modal genérico. */
  getById(id: number): Observable<{ success: boolean; data: AppNotification }> {
    return this.http.get<{ success: boolean; data: AppNotification }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminNotificationService.getById', error);
        throw error;
      }),
    );
  }

  /** Crea una notificación manual para un destinatario elegido por Firebase UID. */
  create(payload: NotificationCreateRequest): Observable<{ success: boolean; data: AppNotification }> {
    return this.http
      .post<{ success: boolean; data: AppNotification }>(this.apiUrl, {
        ...payload,
        type: payload.type ?? 'SYSTEM',
      })
      .pipe(
        catchError((error) => {
          console.error('AdminNotificationService.create', error);
          throw error;
        }),
      );
  }

  /** Actualiza contenido o estado de lectura de una notificación existente. */
  update(payload: NotificationUpdatePayload): Observable<{ success: boolean; data: AppNotification }> {
    const { id, ...body } = payload;
    if (body.isRead === true && Object.keys(body).length === 1) {
      return this.http
        .patch<{ success: boolean; data: AppNotification }>(`${this.apiUrl}/${id}/read`, {})
        .pipe(
          catchError((error) => {
            console.error('AdminNotificationService.update (read)', error);
            throw error;
          }),
        );
    }
    return this.http.patch<{ success: boolean; data: AppNotification }>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('AdminNotificationService.update', error);
        throw error;
      }),
    );
  }

  /** Elimina una notificación desde la pantalla de administración. */
  delete(id: number): Observable<NotificationDeleteResponse> {
    return this.http.delete<NotificationDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminNotificationService.delete', error);
        throw error;
      }),
    );
  }
}
