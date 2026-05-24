import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { WeekScheduleClassesResponse } from '../../../../models/week-schedule-flow/week-schedule-class.model';

/**
 * Cliente HTTP del listado de **clases** para horarios semanales (CURSO-70).
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-70
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleClassesHttpService {
  /** Cliente HTTP usado exclusivamente para consultar clases agregadas de horarios. */
  private readonly http = inject(HttpClient);

  /** Endpoint que agrupa curso, nivel, grupo y año escolar para el selector del builder. */
  private readonly apiUrl = `${environment.apiUrl}/horarios-semanales/classes`;

  /**
   * `GET /api/horarios-semanales/classes` — listado de clases del año indicado.
   *
   * @param schoolYear - Curso escolar usado por el backend para filtrar clases y horarios existentes
   */
  getAllClasses(
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<WeekScheduleClassesResponse> {
    const params = new HttpParams().set('schoolYear', schoolYear);

    return this.http.get<WeekScheduleClassesResponse>(this.apiUrl, { params }).pipe(
      catchError(() => of({ success: false, count: 0, data: [] })),
    );
  }
}
