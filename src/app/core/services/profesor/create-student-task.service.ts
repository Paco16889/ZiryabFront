import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StudentTaskCreateBulkResponse } from '../../models/studentTask';
import { StudentByFiltersRequest } from '../../models/enrollment';
import { EnrollmentHttpService } from '../admin/entities/services-for-week-schedule/enrollment-http.service';

/**
 * Servicio responsable de orquestar la creación de StudentTasks en bulk.
 * Se invoca tras recibir el success del POST de una tarea.
 */
@Injectable({
  providedIn: 'root'
})
export class CreateStudentTaskService {

  /** Cliente HTTP usado para invocar el endpoint bulk de StudentTasks. */
  private readonly http = inject(HttpClient);

  /** Cliente de matrículas para resolver alumnos por asignatura, grupo y año. */
  private readonly enrollments = inject(EnrollmentHttpService);

  /** Endpoint base de entregas de alumno. */
  private readonly studentTasksUrl = `${environment.apiUrl}/student-tasks`;

  /**
   * Obtiene los enrollments del grupo y crea las StudentTasks en bulk.
   * @param idTask ID de la tarea recién creada.
   * @param filters idSubject, idGroup y schoolYear extraídos del teacherAssignment.
   */
  createStudentTasks(
    idTask: number,
    filters: StudentByFiltersRequest
  ): Observable<StudentTaskCreateBulkResponse> {

    return this.enrollments.getByFilters(filters).pipe(
      switchMap(enrollmentRes => {
        const enrollmentIds = enrollmentRes.data.map((e) => e.id);

        return this.http.post<StudentTaskCreateBulkResponse>(
          `${this.studentTasksUrl}/bulk`,
          { idTask, enrollmentIds }
        );
      })
    );
  }
}
