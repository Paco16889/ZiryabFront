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
  const created = new Date(n.createdAt);
  return {
    id: n.id,
    idStudent: null,
    idTeacher: null,
    isRead: n.isRead,
    entityType: 'SYSTEM',
    entityId: n.id,
    action: 'TASK_CREATED',
    title: n.title,
    body: n.message,
    scheduledFor: created,
    createdAt: created,
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
    idStudent: 42,
    idTeacher: null,
    isRead: false,
    entityType: 'TASK',
    entityId: 10,
    action: 'TASK_CREATED',
    title: 'Nueva tarea asignada',
    body: 'Se te ha asignado la tarea "Ejercicios tema 3".',
    scheduledFor: new Date(Date.now() - 1000 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    idStudent: 42,
    idTeacher: null,
    isRead: false,
    entityType: 'TASK',
    entityId: 10,
    action: 'TASK_DEADLINE_APPROACHING',
    title: 'Entrega próxima',
    body: 'La tarea "Ejercicios tema 3" vence mañana.',
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60),
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 3,
    idStudent: null,
    idTeacher: 7,
    isRead: false,
    entityType: 'STUDENT_TASK',
    entityId: 88,
    action: 'TASK_SUBMITTED',
    title: 'Entrega recibida',
    body: 'Un alumno ha entregado la tarea "Ejercicios tema 3".',
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 4,
    idStudent: 42,
    idTeacher: null,
    isRead: true,
    entityType: 'STUDENT_TASK',
    entityId: 88,
    action: 'TASK_GRADED',
    title: 'Tarea calificada',
    body: 'Tu tarea "Ejercicios tema 3" ha sido calificada.',
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 5),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 5,
    idStudent: null,
    idTeacher: 7,
    isRead: true,
    entityType: 'ASSISTANCE',
    entityId: 33,
    action: 'JUSTIFICATION_SUBMITTED',
    title: 'Justificante recibido',
    body: 'Un alumno ha enviado un justificante de ausencia.',
    scheduledFor: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];