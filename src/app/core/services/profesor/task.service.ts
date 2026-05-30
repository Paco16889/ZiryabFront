import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import {
  Task,
  GetTasksResponse,
  GetTaskByIdResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from '../../models/teacher/tasks';
import { CreateStudentTaskService } from './create-student-task.service';
import { environment } from '../../../../environments/environment';

/**
 * Servicio de profesorado para gestionar tareas de una asignación docente.
 *
 * Mantiene en signals el listado visible en la pantalla de tareas del profesor
 * y encapsula las llamadas al backend de `/api/tasks`. Además ofrece el flujo
 * compuesto que crea la tarea y, acto seguido, genera una StudentTask para cada
 * matrícula del grupo/asignatura correspondiente.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /**
   * Endpoint base del módulo de tareas del backend.
   * Actualmente apunta al backend local usado por las pantallas de profesorado.
   */
  private apiUrl = `${environment.apiUrl}/tasks`;

  /**
   * Inyecta las dependencias usadas en el flujo de tareas del profesor.
   * @param http Cliente HTTP de Angular para realizar las peticiones a la API de tareas.
   * @param createStudentTaskService Genera las StudentTasks en bulk tras crear una tarea nueva.
   */
  constructor(
    private http: HttpClient,
    private createStudentTaskService: CreateStudentTaskService,
  ) {}

  /**
   * Tareas de la asignación docente actualmente abierta en la vista del profesor.
   */
  tasks = signal<Task[]>([]);

  /**
   * Tarea seleccionada para detalle o edición sin volver a consultar el listado.
   */
  selectedTask = signal<Task | null>(null);

  /**
   * Indica si la pantalla está esperando la carga de tareas.
   */
  loading = signal<boolean>(false);

  // ============================================
  // CARGA DE SIGNALS
  // ============================================

  /**
   * Carga las tareas de una asignación profesor-asignatura-grupo y refresca `tasks`.
   * Si el backend responde con `success: false`, la pantalla queda en estado vacío.
   *
   * @param idTeacherAssignment ID de la asignación del profesor.
   * @returns No devuelve valor; actualiza las signals `tasks` y `loading` al completar la petición.
   */
  loadTasksByAssignment(idTeacherAssignment: number): void {
    this.loading.set(true);
    this.getTasksByAssignment(idTeacherAssignment).subscribe(res => {
      if (res.success) {
        this.tasks.set(res.data);
      } else {
        this.tasks.set([]);
      }
      this.loading.set(false);
    });
  }

  /**
   * Limpia el estado local al salir de la vista o cambiar de asignación.
   * @returns No devuelve valor; deja las signals de tareas en estado inicial.
   */
  clearTasks(): void {
    this.tasks.set([]);
    this.selectedTask.set(null);
    this.loading.set(false);
  }

  // ============================================
  // PETICIONES HTTP
  // ============================================

  /**
   * Consulta el listado de tareas que pertenecen a una asignación docente concreta.
   * Devuelve una respuesta vacía si la petición falla para que la vista pueda
   * recuperarse sin romper el renderizado.
   *
   * @param idTeacherAssignment - ID de la asignación del profesor
   * @returns Observable con la respuesta que contiene el listado de tareas
   */
  getTasksByAssignment(idTeacherAssignment: number): Observable<GetTasksResponse> {
    return this.http.get<GetTasksResponse>(`${this.apiUrl}/teacher-assignment/${idTeacherAssignment}`).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene el detalle completo de una tarea, incluyendo asignación docente,
   * grupo y entregas de alumnos cuando el backend las expande.
   *
   * @param id - Identificador único de la tarea
   * @returns Observable con la respuesta que contiene la tarea encontrada
   */
  getTaskById(id: number): Observable<GetTaskByIdResponse> {
    return this.http.get<GetTaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una tarea desde el formulario del profesor.
   * Acepta `FormData` para soportar adjuntos además del payload JSON tipado.
   *
   * @param data - Datos necesarios para crear la tarea
   * @returns Observable con la respuesta que contiene la tarea creada
   */
  createTask(data: CreateTaskRequest | FormData): Observable<CreateTaskResponse> {
    return this.http.post<CreateTaskResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una tarea y genera automáticamente las StudentTasks en bulk para los
   * alumnos matriculados en la misma asignatura, grupo y curso escolar.
   *
   * Flujo funcional:
   * 1. `POST /api/tasks` crea la tarea y devuelve su `teacherAssignment`.
   * 2. `CreateStudentTaskService` busca matrículas por asignatura/grupo/año.
   * 3. `POST /api/student-tasks/bulk` crea una entrega por alumno.
   *
   * @param data - Datos validados del formulario de creación de tareas
   * @returns La respuesta original de creación de tarea cuando el bulk finaliza correctamente
   */
  createTaskWithStudentTasks(data: CreateTaskRequest): Observable<CreateTaskResponse> {
    return this.createTask(data).pipe(
      switchMap(taskRes => {
        const { id, schoolYear, teacherAssignment } = taskRes.data;
        return this.createStudentTaskService.createStudentTasks(id, {
          idSubject: teacherAssignment.idSubject,
          idGroup: teacherAssignment.idGroup,
          schoolYear,
        }).pipe(
          switchMap(() => of(taskRes))
        );
      }),
      catchError(error => {
        console.error('Error en createTaskWithStudentTasks:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza campos editables de una tarea sin regenerar entregas de alumnos.
   *
   * @param id   - Identificador único de la tarea a actualizar
   * @param data - Campos a modificar
   * @returns Observable con la respuesta que contiene la tarea actualizada
   */
  updateTask(id: number, data: UpdateTaskRequest): Observable<UpdateTaskResponse> {
    return this.http.patch<UpdateTaskResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina una tarea por su identificador.
   * La eliminación de entregas relacionadas queda delegada al contrato del backend.
   *
   * @param id - Identificador único de la tarea a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteTask(id: number): Observable<DeleteTaskResponse> {
    return this.http.delete<DeleteTaskResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }
}