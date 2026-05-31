import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import {
  WeekScheduleBulkGenerateRequest,
  WeekScheduleBulkGenerateResponse,
} from '../../../../models/week-schedule-flow/week-schedule-materialize.model';

/**
 * Lanza la generación masiva de ClassSessions para una plantilla horaria.
 * Se llama en fire-and-forget tras materializar la plantilla (EQ-297).
 */
@Injectable({ providedIn: 'root' })
export class WeekScheduleBulkGenerateHttpService {
  /** Cliente HTTP de Angular. */
  private readonly http = inject(HttpClient);

  /** Endpoint de generación masiva de sesiones. */
  private readonly apiUrl = `${environment.apiUrl}/sessions/bulk-generate`;

  /**
   * POST /api/sessions/bulk-generate — genera ClassSessions en bloque.
   * @param body Clase y año escolar para los que se generan sesiones.
   */
  bulkGenerate(body: WeekScheduleBulkGenerateRequest): Observable<WeekScheduleBulkGenerateResponse> {
    return this.http.post<WeekScheduleBulkGenerateResponse>(this.apiUrl, body).pipe(
      catchError((err) =>
        of({
          success: false,
          error:
            (err?.error?.error as string) ??
            (err?.error?.message as string) ??
            'Error al generar sesiones de clase',
        })
      )
    );
  }
}
