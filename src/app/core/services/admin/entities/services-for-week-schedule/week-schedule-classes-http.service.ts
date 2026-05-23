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
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/horarios-semanales/classes`;

  /**
   * `GET /api/horarios-semanales/classes` — listado de clases del año indicado.
   */
  getAllClasses(
    schoolYear: string = environment.currentSchoolYear,
    withoutScheduleOnly = false,
  ): Observable<WeekScheduleClassesResponse> {
    let params = new HttpParams().set('schoolYear', schoolYear);
    if (withoutScheduleOnly) {
      params = params.set('hasWeekSchedule', 'false');
    }

    return this.http.get<WeekScheduleClassesResponse>(this.apiUrl, { params }).pipe(
      catchError(() => of({ success: false, count: 0, data: [] })),
    );
  }
}
