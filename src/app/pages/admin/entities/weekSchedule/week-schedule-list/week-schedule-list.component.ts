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
  private readonly weekScheduleService = inject(WeekScheduleService);

  onScheduleSaved(): void {
    this.weekScheduleService.loadSchedules();
  }
}
