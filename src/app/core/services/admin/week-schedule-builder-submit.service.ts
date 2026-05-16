import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { WeekScheduleCreateRequest } from '../../models/week-schedule';
import { WeekScheduleService } from './entities/week-schedule.service';

/**
 * Capa fina sobre `WeekScheduleService` para el flujo del builder admin:
 * normaliza la respuesta de creación a éxito booleano y convierte errores HTTP.
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleBuilderSubmitService {
  private readonly schedules = inject(WeekScheduleService);

  /**
   * Envía el POST de nueva franja y devuelve si el backend respondió con éxito.
   */
  createWeeklySlot(payload: WeekScheduleCreateRequest): Observable<boolean> {
    return this.schedules.createSchedule(payload).pipe(
      map((r) => r.success),
      catchError(() => of(false)),
    );
  }
}
