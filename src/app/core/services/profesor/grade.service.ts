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

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/grades`;

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

  upsertGrade(grade: CreateGradeRequest): Observable<ApiResponse<Grade>> {
    return this.http.post<ApiResponse<Grade>>(this.apiUrl, grade);
  }

  bulkUpsertGrades(
    request: BulkCreateGradesRequest
  ): Observable<ApiResponse<Grade[]>> {
    return this.http.post<ApiResponse<Grade[]>>(`${this.apiUrl}/bulk`, request);
  }
}
