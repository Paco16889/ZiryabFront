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
  /** Cliente HTTP de Angular. */
  private readonly http = inject(HttpClient);

  /** Endpoint de materialización de plantilla semanal. */
  private readonly apiUrl = `${environment.apiUrl}/horarios-semanales/materialize`;

  /**
   * `POST /api/horarios-semanales/materialize`
   * @param body Plantilla semanal a persistir (días, franjas y metadatos de clase).
   */
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
