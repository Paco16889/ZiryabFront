import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AssignTutorResponse, CourseGroup, CourseGroupsResponse } from '../../../models/course-group';

@Injectable({ providedIn: 'root' })
export class CourseGroupService {
  private readonly apiUrl = `${environment.apiUrl}/course-groups`;
  private readonly http = inject(HttpClient);

  getAll(): Observable<CourseGroupsResponse> {
    return this.http.get<CourseGroupsResponse>(this.apiUrl).pipe(
      catchError((err) => { throw err; })
    );
  }

  create(idCourse: number, idGroup: number, grade: string): Observable<{ success: boolean; data: CourseGroup }> {
    return this.http.post<{ success: boolean; data: CourseGroup }>(this.apiUrl, { idCourse, idGroup, grade }).pipe(
      catchError((err) => { throw err; })
    );
  }

  assignTutor(id: number, tutorId: number | null): Observable<AssignTutorResponse> {
    return this.http.patch<AssignTutorResponse>(`${this.apiUrl}/${id}/tutor`, { tutorId }).pipe(
      catchError((err) => { throw err; })
    );
  }

  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => { throw err; })
    );
  }
}
