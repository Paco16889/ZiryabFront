import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { AssignTutorResponse, CourseGroup, CourseGroupsResponse } from '../../../models/course-group';

/** Cliente HTTP para la gestión admin de grupos dentro de ciclos (`/api/course-groups`). */
@Injectable({ providedIn: 'root' })
export class CourseGroupService {
  /** Base URL del recurso `course-groups`. */
  private readonly apiUrl = `${environment.apiUrl}/course-groups`;

  /** Cliente HTTP de Angular. */
  private readonly http = inject(HttpClient);

  /** Lista todas las relaciones ciclo–grupo. */
  getAll(): Observable<CourseGroupsResponse> {
    return this.http.get<CourseGroupsResponse>(this.apiUrl).pipe(
      catchError((err) => { throw err; })
    );
  }

  /**
   * Vincula un grupo a un ciclo en un curso concreto.
   * @param idCourse Identificador del ciclo.
   * @param idGroup Identificador del grupo.
   * @param grade Curso dentro del ciclo (`"1"` o `"2"`).
   */
  create(idCourse: number, idGroup: number, grade: string): Observable<{ success: boolean; data: CourseGroup }> {
    return this.http.post<{ success: boolean; data: CourseGroup }>(this.apiUrl, { idCourse, idGroup, grade }).pipe(
      catchError((err) => { throw err; })
    );
  }

  /**
   * Asigna o quita el tutor de un grupo en ciclo.
   * @param id Identificador de `course_groups`.
   * @param tutorId Profesor tutor o `null` para desasignar.
   */
  assignTutor(id: number, tutorId: number | null): Observable<AssignTutorResponse> {
    return this.http.patch<AssignTutorResponse>(`${this.apiUrl}/${id}/tutor`, { tutorId }).pipe(
      catchError((err) => { throw err; })
    );
  }

  /**
   * Elimina la vinculación ciclo–grupo.
   * @param id Identificador de `course_groups`.
   */
  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`).pipe(
      catchError((err) => { throw err; })
    );
  }
}
