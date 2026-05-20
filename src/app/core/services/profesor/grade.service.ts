import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../auth.service';
import { Grade, CreateGradeRequest, BulkCreateGradesRequest, EvaluationPeriod, MyGradesResponse } from '../../models/grade';
import { Group } from '../../models/group';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/grades`;

  getMyGrades(): Observable<ApiResponse<MyGradesResponse[]>> {
    return this.http.get<ApiResponse<MyGradesResponse[]>>(`${this.apiUrl}/my`);
  }

  getTutoredGroups(): Observable<ApiResponse<Group[]>> {
    return this.http.get<ApiResponse<Group[]>>(`${this.apiUrl}/tutored-groups`);
  }

  getGradesByGroupAndPeriod(idGroup: number, period: EvaluationPeriod): Observable<ApiResponse<Grade[]>> {
    return this.http.get<ApiResponse<Grade[]>>(`${this.apiUrl}/group/${idGroup}/period/${period}`);
  }

  upsertGrade(grade: CreateGradeRequest): Observable<ApiResponse<Grade>> {
    return this.http.post<ApiResponse<Grade>>(this.apiUrl, grade);
  }

  bulkUpsertGrades(request: BulkCreateGradesRequest): Observable<ApiResponse<Grade[]>> {
    return this.http.post<ApiResponse<Grade[]>>(`${this.apiUrl}/bulk`, request);
  }
}
