import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Tarjeta de una franja horaria (inicio–fin) dentro de un día.
 * El contenido concreto (celda, desplegable, etc.) se proyecta con `ng-content`.
 */
@Component({
  selector: 'app-week-schedule-hour-card',
  standalone: true,
  templateUrl: './week-schedule-hour-card.component.html',
  styleUrl: './week-schedule-hour-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleHourCardComponent {
  /** Hora inicio (`HH:mm`). */
  readonly startTime = input.required<string>();
  /** Hora fin (`HH:mm`). */
  readonly finishTime = input.required<string>();

  readonly rangeLabel = computed(() => `${this.startTime()} – ${this.finishTime()}`);
}
