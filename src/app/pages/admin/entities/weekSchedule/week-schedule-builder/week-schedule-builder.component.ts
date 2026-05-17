import { Component, output } from '@angular/core';
import { WeekScheduleGridBuilderComponent } from '../week-schedule-grid-builder/week-schedule-grid-builder.component';

/**
 * Punto de entrada del flujo de creación de horarios en admin.
 * Delega en la rejilla semanal L–V (`WeekScheduleGridBuilderComponent`).
 */
@Component({
  selector: 'app-week-schedule-builder',
  standalone: true,
  imports: [WeekScheduleGridBuilderComponent],
  templateUrl: './week-schedule-builder.component.html',
  styleUrl: './week-schedule-builder.component.scss',
})
export class WeekScheduleBuilderComponent {
  readonly cancelCreate = output<void>();
  readonly scheduleCreated = output<void>();

  onCancel(): void {
    this.cancelCreate.emit();
  }

  onGridScheduleSaved(): void {
    this.scheduleCreated.emit();
  }
}
