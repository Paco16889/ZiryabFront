import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Task, TaskByIdResponse, TasksAllResponse, TaskCreateRequest, TaskCreateResponse, TaskDeleteResponse, TaskUpdateRequest, TaskUpdateResponse } from '../../../models/task';

/**
 * Servicio encargado de gestionar las operaciones con tareas.
 * Incluye una signal para mantener el estado de las tareas en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
   /**
   * URL base del endpoint de tareas.
   */
  private apiUrl = 'http://localhost:3000/api/tasks'; // aquí el código }

  /**
   * Signal que almacena el listado completo de tareas en memoria.
   */
  tasks = signal<Task[]>([]); // aquí el código }

  /**
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { } 

  /**
   * Carga todas las tareas e inicializa la signal tasks.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadTasks() {
    this.getAllTasks().subscribe(res => {
      if (res.success) {
        this.tasks.set(res.data);
      } else {
        this.tasks.set([]);
      }
    });
  }

  /**
   * Obtiene todas las tareas.
   * @returns Observable con la respuesta que contiene el listado de tareas
   */
  getAllTasks(): Observable<TasksAllResponse> {
    return this.http.get<TasksAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene una tarea por su identificador.
   * @param id - Identificador único de la tarea
   * @returns Observable con la respuesta que contiene la tarea encontrada
   */
  getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una nueva tarea.
   * @param data - Datos necesarios para crear la tarea
   * @returns Observable con la respuesta que contiene la tarea creada
   */
  createTask(data: TaskCreateRequest): Observable<TaskCreateResponse> {
    return this.http.post<TaskCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating task:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza una tarea existente.
   * @param id - Identificador único de la tarea a actualizar
   * @param data - Datos de la tarea a actualizar
   * @returns Observable con la respuesta que contiene la tarea actualizada
   */
  updateTask(id: number, data: TaskUpdateRequest): Observable<TaskUpdateResponse> {
    return this.http.patch<TaskUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating task:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina una tarea por su identificador.
   * @param id - Identificador único de la tarea a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteTask(id: number): Observable<TaskDeleteResponse> {
    return this.http.delete<TaskDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting task:', error);
        throw error;
      })
    );
  }
  }

 