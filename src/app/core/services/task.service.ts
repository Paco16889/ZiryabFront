import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TasksAllResponse, TaskByIdResponse } from '../models/task';

/**
 * Servicio encargado de la gestión global de Tareas (Tasks).
 * Se comunica con el backend para obtener las asignaciones subidas por los profesores.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks';

  /**
   * Obtiene la lista con todas las tareas registradas en el sistema.
   * @returns Observable con la respuesta completa de las tareas.
   */
  getAllTasks(): Observable<TasksAllResponse> {
    return this.http.get<TasksAllResponse>(this.apiUrl);
  }

  /**
   * Obtiene los detalles de una tarea específica por su ID.
   * @param id Identificador único de la tarea.
   * @returns Observable con la información de la tarea especificada.
   */
  getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.apiUrl}/${id}`);
  }
}
