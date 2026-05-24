import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { AssignmentsWithIncludesResponse } from '../../../../models/assingment';
import { GetAsignaturasProfesorResponse } from '../../../../models/teacher/subjectforteacher';

/**
 * Cliente HTTP de **asignaciones docente** (`/api/assignments`) para el flujo de horarios (CURSO-59).
 *
 * Sustituye los endpoints deprecados de enrollments que devolvían `TeacherOnSubjectOnGroup`.
 *
 * @see https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1277953
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-59
 */
@Injectable({
  providedIn: 'root',
})
export class AssignmentHttpService {
  /** Cliente HTTP para el módulo backend de asignaciones docentes. */
  private readonly http = inject(HttpClient);

  /** Endpoint base de asignaciones profesor-asignatura-grupo. */
  private readonly apiUrl = `${environment.apiUrl}/assignments`;

  /**
   * `GET /api/assignments` — listado global con `teacher`, `subject` y `group` incluidos.
   * Lo usa el builder de horarios para componer las opciones de cada celda.
   */
  getAll(): Observable<AssignmentsWithIncludesResponse> {
    return this.http.get<AssignmentsWithIncludesResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  /**
   * `GET /api/assignments/teacher/:idTeacher?schoolYear=...` — asignaciones de un profesor en un año.
   *
   * @param idTeacher - Identificador del profesor
   * @param schoolYear - Año académico obligatorio (ej. `2024-2025`)
   */
  getByTeacher(
    idTeacher: number,
    schoolYear: string,
  ): Observable<GetAsignaturasProfesorResponse> {
    const params = new HttpParams().set('schoolYear', schoolYear);

    return this.http
      .get<GetAsignaturasProfesorResponse>(`${this.apiUrl}/teacher/${idTeacher}`, { params })
      .pipe(catchError(() => of({ success: false, data: [], count: 0 })));
  }
}
