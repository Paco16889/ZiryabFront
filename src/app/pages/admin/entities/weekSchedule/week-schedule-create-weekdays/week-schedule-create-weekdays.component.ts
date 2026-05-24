import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** Días laborables L–V para la plantilla horaria (`weekDay` 1–5). */
export const WEEK_SCHEDULE_CREATE_WEEKDAYS = [1, 2, 3, 4, 5] as const;

/**
 * Checkboxes de días laborables (L–V) para la plantilla horaria.
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-90
 */
@Component({
  selector: 'app-week-schedule-create-weekdays',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './week-schedule-create-weekdays.component.html',
  styleUrl: './week-schedule-create-weekdays.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleCreateWeekdaysComponent {
  /** Días que puede elegir el administrador en esta primera versión: lunes a viernes. */
  readonly weekdays = WEEK_SCHEDULE_CREATE_WEEKDAYS;

  /** Días seleccionados (`weekDay` 1–5). */
  readonly selectedWeekDays = input<number[]>([]);
  /** Muestra error si no hay ningún día (p. ej. tras intentar enviar el formulario padre). */
  readonly showValidation = input(false);

  /** Impide alternar días cuando el flujo padre está bloqueado. */
  readonly disabled = input(false);

  /** Emite la lista ordenada de días seleccionados para mantener el formulario padre como fuente de verdad. */
  readonly weekDaysChange = output<number[]>();

  /** Comprueba si el checkbox de un día debe aparecer marcado. */
  isSelected(day: number): boolean {
    return this.selectedWeekDays().includes(day);
  }

  /**
   * Alterna un día y conserva el resultado ordenado, lo que simplifica la construcción
   * posterior del payload de materialización.
   */
  toggleDay(day: number): void {
    if (this.disabled()) {
      return;
    }
    const next = [...this.selectedWeekDays()];
    const index = next.indexOf(day);
    if (index >= 0) {
      next.splice(index, 1);
    } else {
      next.push(day);
      next.sort((a, b) => a - b);
    }
    this.weekDaysChange.emit(next);
  }

  /** Devuelve la clave i18n del nombre corto del día (`weekScheduleBuilder.days.1`, etc.). */
  dayTranslateKey(day: number): string {
    return `weekScheduleBuilder.days.${day}`;
  }
}
