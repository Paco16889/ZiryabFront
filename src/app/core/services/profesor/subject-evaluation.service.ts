import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../auth.service';
import {
  BulkCreateSubjectEvaluationsRequest,
  CreateSubjectEvaluationRequest,
  EvaluationPeriod,
  MySubjectEvaluationsByEnrollment,
  SubjectEvaluation,
  TutoredGroupForEvaluation,
} from '../../models/subject-evaluation';

/** Servicio de evaluaciones por asignatura (tutor / alumno). */
@Injectable({
  providedIn: 'root',
})
export class SubjectEvaluationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/subject-evaluations`;

  /** Evaluaciones del alumno autenticado agrupadas por matrícula. */
  getMySubjectEvaluations(): Observable<ApiResponse<MySubjectEvaluationsByEnrollment[]>> {
    return this.http.get<ApiResponse<MySubjectEvaluationsByEnrollment[]>>(`${this.apiUrl}/my`);
  }

  /** Clases en las que el profesor es tutor. */
  getTutoredGroups(): Observable<ApiResponse<TutoredGroupForEvaluation[]>> {
    return this.http.get<ApiResponse<TutoredGroupForEvaluation[]>>(
      `${this.apiUrl}/tutored-groups`,
    );
  }

  /** Evaluaciones de un grupo tutorado para un periodo. */
  getByTutorAssignmentAndPeriod(
    idTutorAssignment: number,
    period: EvaluationPeriod,
  ): Observable<ApiResponse<SubjectEvaluation[]>> {
    return this.http.get<ApiResponse<SubjectEvaluation[]>>(
      `${this.apiUrl}/tutor-assignment/${idTutorAssignment}/period/${period}`,
    );
  }

  /** Crea o actualiza una evaluación. */
  upsertSubjectEvaluation(
    payload: CreateSubjectEvaluationRequest,
  ): Observable<ApiResponse<SubjectEvaluation>> {
    return this.http.post<ApiResponse<SubjectEvaluation>>(this.apiUrl, payload);
  }

  /** Guarda varias evaluaciones de una vez. */
  bulkUpsertSubjectEvaluations(
    request: BulkCreateSubjectEvaluationsRequest,
  ): Observable<ApiResponse<SubjectEvaluation[]>> {
    return this.http.post<ApiResponse<SubjectEvaluation[]>>(
      `${this.apiUrl}/bulk`,
      request,
    );
  }
}
