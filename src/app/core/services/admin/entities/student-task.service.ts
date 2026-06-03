import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import {
  StudentTask,
  StudentTaskByIdResponse,
  StudentTasksAllResponse,
  StudentTaskCreateRequest,
  StudentTaskCreateResponse,
  StudentTaskDeleteResponse,
  StudentTaskUpdateRequest,
  StudentTaskUpdateResponse,
} from '../../../models/studentTask';
import { environment } from '../../../../../environments/environment';

/** Payload de actualización de StudentTask con id añadido por el modal genérico. */
export type StudentTaskUpdatePayload = StudentTaskUpdateRequest & { id: number };

/**
 * Servicio encargado de gestionar las operaciones con entregas de tareas de estudiantes.
 * Incluye una signal para mantener el estado de las entregas en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentTaskService { 
  /** Cliente HTTP para el módulo admin de entregas. */
  private readonly http = inject(HttpClient);

  /** URL base del endpoint de entregas de tareas. */
  private readonly apiUrl = `${environment.apiUrl}/student-tasks`;

  /** Cache reactiva de entregas para el listado admin. */
  studentTasks = signal<StudentTask[]>([]);

  /**
   * Carga todas las entregas de tareas e inicializa la signal studentTasks.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadStudentTasks() {
    this.getAllStudentTasks().subscribe(res => {
      if (res.success) {
        this.studentTasks.set(res.data);
      } else {
        this.studentTasks.set([]);
      }
    });
  }

  /**
   * Obtiene todas las entregas de tareas.
   * @returns Observable con la respuesta que contiene el listado de entregas
   */
  getAllStudentTasks(): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene una entrega de tarea por su identificador.
   * @param id Identificador único de la entrega
   * @returns Observable con la respuesta que contiene la entrega encontrada
   */
  getStudentTaskById(id: number): Observable<StudentTaskByIdResponse> {
    return this.http.get<StudentTaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una nueva entrega de tarea.
   * @param data Datos necesarios para crear la entrega
   * @returns Observable con la respuesta que contiene la entrega creada
   */
  createStudentTask(data: StudentTaskCreateRequest): Observable<StudentTaskCreateResponse> {
    return this.http.post<StudentTaskCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating student task:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza una entrega de tarea existente desde el modal genérico.
   * @param payload Datos de la entrega a actualizar, incluido su identificador
   * @returns Observable con la respuesta que contiene la entrega actualizada
   */
  updateStudentTask(payload: StudentTaskUpdatePayload): Observable<StudentTaskUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('Error updating student task:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina una entrega de tarea por su identificador.
   * @param id Identificador único de la entrega a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteStudentTask(id: number): Observable<StudentTaskDeleteResponse> {
    return this.http.delete<StudentTaskDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting student task:', error);
        throw error;
      })
    );
  }
}

 