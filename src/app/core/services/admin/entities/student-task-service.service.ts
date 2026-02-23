import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { StudentTask, StudentTaskByIdResponse, StudentTasksAllResponse, StudentTaskCreateRequest, StudentTaskCreateResponse, StudentTaskDeleteResponse, StudentTaskUpdateRequest, StudentTaskUpdateResponse } from '../../../models/studentTask';

/**
 * Servicio encargado de gestionar las operaciones con entregas de tareas de estudiantes.
 * Incluye una signal para mantener el estado de las entregas en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentTaskServiceService { 
   /**
   * URL base del endpoint de entregas de tareas.
   */
  private apiUrl = 'http://localhost:3000/api/student-tasks'; // aquí el código }

  /**
   * Signal que almacena el listado completo de entregas de tareas en memoria.
   */
  studentTasks = signal<StudentTask[]>([]); // aquí el código }

  /**
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { } // aquí el código }

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
   * @param id - Identificador único de la entrega
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
   * @param data - Datos necesarios para crear la entrega
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
   * Actualiza una entrega de tarea existente.
   * @param id - Identificador único de la entrega a actualizar
   * @param data - Datos de la entrega a actualizar
   * @returns Observable con la respuesta que contiene la entrega actualizada
   */
  updateStudentTask(id: number, data: StudentTaskUpdateRequest): Observable<StudentTaskUpdateResponse> {
    return this.http.patch<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating student task:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina una entrega de tarea por su identificador.
   * @param id - Identificador único de la entrega a eliminar
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

 