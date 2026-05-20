import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  EnrollmentByFiltersResponse,
  StudentByFiltersRequest,
} from '../../../../models/enrollment';

/**
 * Cliente HTTP de **matrículas de alumnos** (`/api/enrollments`) para el flujo de horarios (CURSO-59).
 *
 * Solo expone `by-filters` (estudiantes). Las asignaciones de profesor viven en
 * {@link AssignmentHttpService} (`/api/assignments`).
 *
 * @see https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1277953
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-59
 */
@Injectable({
  providedIn: 'root',
})
export class EnrollmentHttpService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/enrollments`;

  /**
   * `GET /api/enrollments/by-filters` — matrículas de alumnos por asignatura, grupo y año.
   */
  getByFilters(filters: StudentByFiltersRequest): Observable<EnrollmentByFiltersResponse> {
    const params = new HttpParams()
      .set('idSubject', filters.idSubject)
      .set('idGroup', filters.idGroup)
      .set('schoolYear', filters.schoolYear);

    return this.http
      .get<EnrollmentByFiltersResponse>(`${this.apiUrl}/by-filters`, { params })
      .pipe(
        catchError(() =>
          of({
            success: false,
            count: 0,
            data: [],
          }),
        ),
      );
  }
}
