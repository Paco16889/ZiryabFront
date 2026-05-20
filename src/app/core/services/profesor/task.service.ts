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

/**
 * Servicio encargado de gestionar las operaciones con tareas.
 * Incluye una signal para mantener el estado de las tareas en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  /**
   * URL base del endpoint de tareas.
   */
  private apiUrl = 'http://localhost:3000/api/tasks';

  /**
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient,
      private createStudentTaskService: CreateStudentTaskService

  ) {}

  /**
   * Signal que almacena el listado de tareas de la asignación activa.
   */
  tasks = signal<Task[]>([]);

  /**
   * Signal que almacena la tarea seleccionada para detalle o edición.
   */
  selectedTask = signal<Task | null>(null);

  /**
   * Signal que indica si hay una petición en curso.
   */
  loading = signal<boolean>(false);

  // ============================================
  // CARGA DE SIGNALS
  // ============================================

  /**
   * Carga las tareas de una asignación e inicializa la signal `tasks`.
   * Si la petición falla, la signal se establece como array vacío.
   * @param idTeacherAssignment - ID de la asignación del profesor
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
   * Limpia el estado local al salir de la vista de tareas.
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
   * Obtiene todas las tareas de una asignación concreta.
   * @param idTeacherAssignment - ID de la asignación del profesor
   * @returns Observable con la respuesta que contiene el listado de tareas
   */
  getTasksByAssignment(idTeacherAssignment: number): Observable<GetTasksResponse> {
    return this.http.get<GetTasksResponse>(`${this.apiUrl}/teacher-assignment/${idTeacherAssignment}`).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene el detalle de una tarea por su identificador.
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
   * Crea una nueva tarea.
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
 * Crea una tarea y genera automáticamente las StudentTasks en bulk
 * para todos los alumnos matriculados en la asignatura y grupo correspondientes.
 *
 * Flujo:
 * 1. POST /api/tasks → crea la tarea
 * 2. POST /api/student-tasks/bulk → crea una StudentTask por alumno
 *
 * @param data - Datos necesarios para crear la tarea
 * @returns Observable con el CreateTaskResponse de la tarea creada
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
   * Actualiza una tarea existente.
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