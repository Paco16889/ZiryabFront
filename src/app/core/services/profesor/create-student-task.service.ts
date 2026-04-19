import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import {
  StudentTaskCreateBulkRequest,
  StudentTaskCreateBulkResponse,
} from '../../models/studentTask';
import {
  StudentByFiltersRequest,
  EnrollmentByFiltersResponse,
} from '../../models/enrollment';

/**
 * Servicio responsable de orquestar la creación de StudentTasks en bulk.
 * Se invoca tras recibir el success del POST de una tarea.
 */
@Injectable({
  providedIn: 'root'
})
export class CreateStudentTaskService {

  private enrollmentsUrl = 'http://localhost:3000/api/enrollments';
  private studentTasksUrl = 'http://localhost:3000/api/student-tasks';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los enrollments del grupo y crea las StudentTasks en bulk.
   * @param idTask - ID de la tarea recién creada
   * @param filters - idSubject, idGroup y schoolYear extraídos del teacherAssignment
   */
  createStudentTasks(
    idTask: number,
    filters: StudentByFiltersRequest
  ): Observable<StudentTaskCreateBulkResponse> {

    const params = new HttpParams()
      .set('idSubject', filters.idSubject)
      .set('idGroup', filters.idGroup)
      .set('schoolYear', filters.schoolYear);

    return this.http.get<EnrollmentByFiltersResponse>(
      `${this.enrollmentsUrl}/by-filters`,
      { params }
    ).pipe(
      switchMap(enrollmentRes => {
        const enrollmentIds = enrollmentRes.data.map((e: { id: any; }) => e.id);

        return this.http.post<StudentTaskCreateBulkResponse>(
          `${this.studentTasksUrl}/bulk`,
          { idTask, enrollmentIds }
        );
      })
    );
  }
}