import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Task,
  TaskByIdResponse,
  TaskCreateRequest,
  TaskCreateResponse,
  TaskDeleteResponse,
  TasksAllResponse,
  TaskUpdateRequest,
  TaskUpdateResponse,
} from '../../../models/task';

/** Payload de actualización incluye `id` (lo añade el modal genérico). */
export type TaskUpdatePayload = TaskUpdateRequest & { id: number };

/**
 * Servicio admin de tareas (`/api/tasks`). Patrón de referencia CURSO-103.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminTaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  readonly tasks = signal<Task[]>([]);

  getAllTasks(): Observable<TasksAllResponse> {
    return this.http.get<TasksAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  loadTasks(): void {
    this.getAllTasks().subscribe((res) => {
      this.tasks.set(res.success ? res.data : []);
    });
  }

  getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminTaskService.getTaskById', error);
        throw error;
      }),
    );
  }

  createTask(payload: TaskCreateRequest): Observable<TaskCreateResponse> {
    return this.http.post<TaskCreateResponse>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('AdminTaskService.createTask', error);
        throw error;
      }),
    );
  }

  updateTask(payload: TaskUpdatePayload): Observable<TaskUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<TaskUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('AdminTaskService.updateTask', error);
        throw error;
      }),
    );
  }

  deleteTask(id: number): Observable<TaskDeleteResponse> {
    return this.http.delete<TaskDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminTaskService.deleteTask', error);
        throw error;
      }),
    );
  }
}
