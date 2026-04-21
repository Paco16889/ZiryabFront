import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StudentTasksAllResponse,
  StudentTaskByIdResponse,
  StudentTaskUpdateResponse
} from '../../models/studentTask';

/**
 * Servicio responsable de gestionar la comunicación con la API
 * para las tareas de los estudiantes (StudentTasks).
 */
@Injectable({
  providedIn: 'root'
})
export class StudentTaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/student-tasks';

  /**
   * Obtiene la lista completa de tareas asignadas al alumno autenticado.
   * @returns Observable con la respuesta que contiene el array de tareas del estudiante.
   */
  getAllStudentTasks(): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(this.apiUrl);
  }

  /**
   * Obtiene los detalles de una tarea de estudiante específica.
   * @param id Identificador único de la entrega (StudentTask).
   * @returns Observable con los detalles de la tarea.
   */
  getStudentTaskById(id: number): Observable<StudentTaskByIdResponse> {
    return this.http.get<StudentTaskByIdResponse>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las entregas de los estudiantes para una tarea específica. (Uso de Profesor)
   * @param taskId Identificador de la tarea base (Task).
   * @returns Observable con el listado de entregas de esa tarea.
   */
  getStudentTasksByTask(taskId: number): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(`${this.apiUrl}/task/${taskId}`);
  }

  /**
   * Envía la resolución/entrega de una tarea por parte del alumno.
   * @param id Identificador de la entrega (StudentTask).
   * @param data Objeto con la URL del archivo adjunto o resolución.
   * @returns Observable con la confirmación de la entrega.
   */
  submitStudentTask(id: number, data: { attachmentUrl?: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/submit`, data);
  }

  /**
   * Anula o deshace una entrega previa de una tarea.
   * @param id Identificador de la entrega (StudentTask).
   * @returns Observable con la confirmación de la anulación.
   */
  unsubmitStudentTask(id: number): Observable<StudentTaskUpdateResponse> {
    return this.http.delete<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/submit`);
  }

  /**
   * Califica la entrega de un alumno.
   * @param id Identificador de la entrega (StudentTask).
   * @param data Objeto con la puntuación y el feedback opcional.
   * @returns Observable con la confirmación de la calificación.
   */
  gradeStudentTask(id: number, data: { score: number, feedback?: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/grade`, data);
  }

  /**
   * Sube un archivo como entrega de la tarea, a un servicio de almacenamiento.
   * @param file Archivo físico o empaquetado a subir por el estudiante.
   * @returns Observable con los metadatos de subida, incluyendo la URL generada.
   */
  uploadSubmissionFile(file: File): Observable<{ success: boolean; message: string; data: { attachmentUrl: string } }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; message: string; data: { attachmentUrl: string } }>(`${this.apiUrl}/upload-submission`, formData);
  }
}
