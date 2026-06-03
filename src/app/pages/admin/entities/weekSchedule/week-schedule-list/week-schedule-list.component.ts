import { Component, inject } from '@angular/core';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';
import { WeekScheduleBuilderComponent } from '../week-schedule-builder/week-schedule-builder.component';

/**
 * Entrada admin de horarios semanales: delega en el builder (plantilla + rejilla).
 * El listado plano por franja (`week-schedule-list-item`) se retiró en favor de ese flujo.
 */
@Component({
  selector: 'app-week-schedule-list',
  standalone: true,
  imports: [WeekScheduleBuilderComponent],
  templateUrl: './week-schedule-list.component.html',
  styleUrl: './week-schedule-list.component.scss',
})
export class WeekScheduleListComponent {
  /** Recarga horarios tras guardar en el builder. */
  private readonly weekScheduleService = inject(WeekScheduleService);

  /** Propaga guardado del builder al servicio de listado. */
  onScheduleSaved(): void {
    this.weekScheduleService.loadSchedules();
  }
}
