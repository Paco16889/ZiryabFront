import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification';

/** Respuesta de `GET /api/notifications` (misma forma que usa `NotificationsService`). */
interface NotificationsListResponse {
  message: string;
  data: ApiNotification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiNotification {
  id: number;
  recipientFirebaseUID: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

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

@Injectable({ providedIn: 'root' })
export class NotificationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

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

  markAsRead(id: number): Observable<void> {
    if (environment.useMockNotifications) {
      return of(undefined);
    }

    return this.http.patch(`${this.apiUrl}/notifications/${id}/read`, {}).pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );
  }

  /** Marca varias como leídas en el servidor (no hay endpoint bulk). */
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

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    recipientFirebaseUID: 'mock-student',
    title: 'Nueva tarea asignada',
    message: 'Se te ha asignado la tarea "Ejercicios tema 3".',
    type: 'TASK',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    recipientFirebaseUID: 'mock-student',
    title: 'Entrega próxima',
    message: 'La tarea "Ejercicios tema 3" vence mañana.',
    type: 'TASK',
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];
