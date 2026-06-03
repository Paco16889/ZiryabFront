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

/** Payload de actualización incluye `id` porque lo añade el modal genérico de administración. */
export type TaskUpdatePayload = TaskUpdateRequest & { id: number };

/**
 * Servicio admin de tareas (`/api/tasks`). Patrón de referencia CURSO-103.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminTaskService {
  /** Cliente HTTP para el módulo de tareas. */
  private readonly http = inject(HttpClient);

  /** Endpoint base de tareas en el backend. */
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  /** Cache reactiva del listado administrativo de tareas. */
  readonly tasks = signal<Task[]>([]);

  /** Obtiene todas las tareas para el listado admin. */
  getAllTasks(): Observable<TasksAllResponse> {
    return this.http.get<TasksAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  /** Carga tareas y actualiza la cache local. */
  loadTasks(): void {
    this.getAllTasks().subscribe((res) => {
      this.tasks.set(res.success ? res.data : []);
    });
  }

  /** Obtiene una tarea por id para el detalle del modal genérico. */
  getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminTaskService.getTaskById', error);
        throw error;
      }),
    );
  }

  /** Crea una tarea desde la pantalla de administración. */
  createTask(payload: TaskCreateRequest): Observable<TaskCreateResponse> {
    return this.http.post<TaskCreateResponse>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('AdminTaskService.createTask', error);
        throw error;
      }),
    );
  }

  /** Actualiza una tarea existente usando el id incluido por el modal. */
  updateTask(payload: TaskUpdatePayload): Observable<TaskUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<TaskUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('AdminTaskService.updateTask', error);
        throw error;
      }),
    );
  }

  /** Elimina una tarea desde el CRUD admin. */
  deleteTask(id: number): Observable<TaskDeleteResponse> {
    return this.http.delete<TaskDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminTaskService.deleteTask', error);
        throw error;
      }),
    );
  }
}
