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
  readonly weekdays = WEEK_SCHEDULE_CREATE_WEEKDAYS;

  /** Días seleccionados (`weekDay` 1–5). */
  readonly selectedWeekDays = input<number[]>([]);
  /** Muestra error si no hay ningún día (p. ej. tras intentar enviar el formulario padre). */
  readonly showValidation = input(false);
  readonly disabled = input(false);

  readonly weekDaysChange = output<number[]>();

  isSelected(day: number): boolean {
    return this.selectedWeekDays().includes(day);
  }

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

  dayTranslateKey(day: number): string {
    return `weekScheduleBuilder.days.${day}`;
  }
}
