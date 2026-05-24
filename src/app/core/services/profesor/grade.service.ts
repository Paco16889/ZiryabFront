import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth.service';
import { Grade, CreateGradeRequest, BulkCreateGradesRequest, EvaluationPeriod, MyGradesResponse } from '../../models/grade';
import { Group } from '../../models/group';

/** Servicio de calificaciones para profesor y alumno autenticados. */
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

  /** Obtiene grupos tutorizados por el profesor para gestión de notas. */
  getTutoredGroups(): Observable<ApiResponse<Group[]>> {
    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/tutored-groups`);
  }

  /** Lista notas de un grupo para un periodo evaluable concreto. */
  getGradesByGroupAndPeriod(idGroup: number, period: EvaluationPeriod): Observable<ApiResponse<Grade[]>> {
    return this.http.get<ApiResponse<Grade[]>>(`${this.apiUrl}/group/${idGroup}/period/${period}`);
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
