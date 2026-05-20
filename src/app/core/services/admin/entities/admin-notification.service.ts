import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AppNotification } from '../../notifications.service';

interface NotificationsListResponse {
  message: string;
  data: AppNotification[];
  pagination?: { total: number };
}

/** Contrato `POST /api/notifications` (CURSO-108 / API actual). */
export interface NotificationCreateRequest {
  recipientFirebaseUID: string;
  title: string;
  message: string;
  type?: string;
}

export interface NotificationUpdatePayload {
  id: number;
  isRead?: boolean;
  title?: string;
  message?: string;
}

export interface NotificationDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}

/**
 * CRUD admin de notificaciones (`/api/notifications`). CURSO-108.
 */
@Injectable({ providedIn: 'root' })
export class AdminNotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  readonly notifications = signal<AppNotification[]>([]);

  loadNotifications(): void {
    this.getAll().subscribe((list) => this.notifications.set(list));
  }

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

  getById(id: number): Observable<{ success: boolean; data: AppNotification }> {
    return this.http.get<{ success: boolean; data: AppNotification }>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminNotificationService.getById', error);
        throw error;
      }),
    );
  }

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

  delete(id: number): Observable<NotificationDeleteResponse> {
    return this.http.delete<NotificationDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminNotificationService.delete', error);
        throw error;
      }),
    );
  }
}
