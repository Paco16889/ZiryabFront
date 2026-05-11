import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({ providedIn: 'root' })
export class NotificationRepository {

  getAll(): Observable<Notification[]> {
    return of(MOCK_NOTIFICATIONS);
  }

  markAsRead(id: number): Observable<void> {
    // TODO: PATCH /notifications/:id/read
    return of(void 0);
  }

  markAllAsRead(): Observable<void> {
    // TODO: PATCH /notifications/read-all
    return of(void 0);
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
    createdAt:   new Date(Date.now() - 1000 * 60 * 5),
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
    createdAt:   new Date(Date.now() - 1000 * 60 * 60),
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
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 2),
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
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 5),
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
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];