import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth.service';
import {
  Grade,
  CreateGradeRequest,
  BulkCreateGradesRequest,
  EvaluationPeriod,
  MyGradesResponse,
  TutoredCourseGroup,
} from '../../models/grade';

/**
 * @deprecated Usar {@link SubjectEvaluationService} (`/api/subject-evaluations`).
 * Se mantiene solo por referencia; ya no lo usa la app.
 */
@Injectable({
  providedIn: 'root',
})
export class GradeService {
  /** Cliente HTTP para endpoints de notas. */
  private http = inject(HttpClient);

  /** Endpoint base de calificaciones. */
  private apiUrl = `${environment.apiUrl}/grades`;

  /** Obtiene las notas agrupadas por asignatura del alumno autenticado. */
  getMyGrades(): Observable<ApiResponse<MyGradesResponse[]>> {
    return this.http.get<ApiResponse<MyGradesResponse[]>>(`${this.apiUrl}/my`);
  }

  /** Devuelve las clases (CourseGroup) de las que el profesor autenticado es tutor */
  getTutoredGroups(): Observable<ApiResponse<TutoredCourseGroup[]>> {
    return this.http.get<ApiResponse<TutoredCourseGroup[]>>(
      `${this.apiUrl}/tutored-groups`
    );
  }

  /** Notas de una clase (CourseGroup) para un periodo */
  getGradesByCourseGroupAndPeriod(
    courseGroupId: number,
    period: EvaluationPeriod
  ): Observable<ApiResponse<Grade[]>> {
    return this.http.get<ApiResponse<Grade[]>>(
      `${this.apiUrl}/course-group/${courseGroupId}/period/${period}`
    );
  }

  /** Crea o actualiza una calificación individual. */
  upsertGrade(grade: CreateGradeRequest): Observable<ApiResponse<Grade>> {
    return this.http.post<ApiResponse<Grade>>(this.apiUrl, grade);
  }

  /** Guarda varias calificaciones de una vez desde la tabla de gestión. */
  bulkUpsertGrades(request: BulkCreateGradesRequest): Observable<ApiResponse<Grade[]>> {
    return this.http.post<ApiResponse<Grade[]>>(`${this.apiUrl}/bulk`, request);
  }
}
