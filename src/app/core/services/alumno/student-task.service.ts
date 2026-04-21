import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import {
  StudentTask,
  StudentTasksAllResponse,
  StudentTaskByIdResponse,
  StudentTaskCreateRequest,
  StudentTaskCreateResponse,
  StudentTaskCreateBulkRequest,
  StudentTaskCreateBulkResponse,
  StudentTaskUpdateRequest,
  StudentTaskUpdateResponse,
  StudentTaskDeleteResponse,
} from '../../models/studentTask';

@Injectable({
  providedIn: 'root'
})
export class StudentTaskService {

  private apiUrl = 'http://localhost:3000/api/student-tasks';

  constructor(private http: HttpClient) {}

  /**
   * Signal con las entregas de la tarea activa.
   */
  studentTasks = signal<StudentTask[]>([]);

  /**
   * Signal con la entrega seleccionada.
   */
  selectedStudentTask = signal<StudentTask | null>(null);

  /**
   * Signal de carga.
   */
  loading = signal<boolean>(false);

  // ============================================
  // CARGA DE SIGNALS
  // ============================================

loadStudentTasksByEnrollment(idStudentEnrollment: number): void {
  this.loading.set(true);
  this.getStudentTasksByEnrollment(idStudentEnrollment).subscribe(res => {
    if (res.success) {
      this.studentTasks.set(res.data);
    } else {
      this.studentTasks.set([]);
    }
    this.loading.set(false);
  });
}

loadStudentTasksByStudent(idStudent: number): void {
  this.loading.set(true);
  this.getStudentTasksByStudent(idStudent).subscribe(res => {
    if (res.success) {
      this.studentTasks.set(res.data);
    } else {
      this.studentTasks.set([]);
    }
    this.loading.set(false);
  });
}
  loadStudentTasksByTask(idTask: number): void {
    this.loading.set(true);
    this.getStudentTasksByTask(idTask).subscribe(res => {
      if (res.success) {
        this.studentTasks.set(res.data);
      } else {
        this.studentTasks.set([]);
      }
      this.loading.set(false);
    });
  }

  clearStudentTasks(): void {
    this.studentTasks.set([]);
    this.selectedStudentTask.set(null);
    this.loading.set(false);
  }

  // ============================================
  // PETICIONES HTTP
  // ============================================

  getAll(): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  getById(id: number): Observable<StudentTaskByIdResponse> {
    return this.http.get<StudentTaskByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => { throw error; })
    );
  }

  // Alias de compatibilidad tras merge
  getAllStudentTasks(): Observable<StudentTasksAllResponse> {
    return this.getAll();
  }

  // Alias de compatibilidad tras merge
  getStudentTaskById(id: number): Observable<StudentTaskByIdResponse> {
    return this.getById(id);
  }

  getStudentTasksByTask(idTask: number): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(`${this.apiUrl}/task/${idTask}`).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

 /**
 * Obtiene las entregas filtradas por ID de matrícula.
 * @param idStudentEnrollment - ID de la matrícula del alumno
 */
getStudentTasksByEnrollment(idStudentEnrollment: number): Observable<StudentTasksAllResponse> {
  return this.http.get<StudentTasksAllResponse>(`${this.apiUrl}/student/${idStudentEnrollment}`).pipe(
    catchError(() => of({ success: false, data: [], count: 0 }))
  );
}

/**
 * Obtiene las entregas filtradas por ID de estudiante.
 * @param idStudent - ID del estudiante
 */
getStudentTasksByStudent(idStudent: number): Observable<StudentTasksAllResponse> {
  return this.http.get<StudentTasksAllResponse>(`${this.apiUrl}/student-id/${idStudent}`).pipe(
    catchError(() => of({ success: false, data: [], count: 0 }))
  );
}
  create(data: StudentTaskCreateRequest): Observable<StudentTaskCreateResponse> {
    return this.http.post<StudentTaskCreateResponse>(this.apiUrl, data).pipe(
      catchError(error => { throw error; })
    );
  }

  /**
   * Crea StudentTasks en masa para una tarea a partir de los IDs de enrollment.
   */
  createBulk(data: StudentTaskCreateBulkRequest): Observable<StudentTaskCreateBulkResponse> {
    return this.http.post<StudentTaskCreateBulkResponse>(`${this.apiUrl}/bulk`, data).pipe(
      catchError(error => { throw error; })
    );
  }

  update(id: number, data: StudentTaskUpdateRequest): Observable<StudentTaskUpdateResponse> {
    return this.http.patch<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(error => { throw error; })
    );
  }

  delete(id: number): Observable<StudentTaskDeleteResponse> {
    return this.http.delete<StudentTaskDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => { throw error; })
    );
  }

  uploadSubmissionFile(file: File): Observable<{ success: boolean; data?: { attachmentUrl: string } }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; data?: { attachmentUrl: string } }>(
      `${this.apiUrl}/upload-submission`,
      formData
    ).pipe(
      catchError(error => { throw error; })
    );
  }

  submitStudentTask(id: number, data: { attachmentUrl: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/submit`, data).pipe(
      catchError(error => { throw error; })
    );
  }

  unsubmitStudentTask(id: number): Observable<StudentTaskUpdateResponse> {
    return this.http.delete<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/submit`).pipe(
      catchError(error => { throw error; })
    );
  }

  gradeStudentTask(id: number, data: { score: number; feedback?: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/grade`, data).pipe(
      catchError(error => { throw error; })
    );
  }
}
