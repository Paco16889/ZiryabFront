import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  WeekScheduleMaterializeRequest,
  WeekScheduleMaterializeResponse,
} from '../../../../models/week-schedule-flow/week-schedule-materialize.model';

/**
 * Cliente HTTP de materialización de plantilla horaria por clase (CURSO-143).
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleMaterializeHttpService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/horarios-semanales/materialize`;

  /** `POST /api/horarios-semanales/materialize` */
  materialize(body: WeekScheduleMaterializeRequest): Observable<WeekScheduleMaterializeResponse> {
    return this.http.post<WeekScheduleMaterializeResponse>(this.apiUrl, body).pipe(
      catchError((err) =>
        of({
          success: false,
          error:
            (err?.error?.error as string) ??
            (err?.error?.message as string) ??
            'Error al crear la plantilla horaria',
        }),
      ),
    );
  }
}
