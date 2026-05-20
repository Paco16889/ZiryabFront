import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Tarjeta mobile-first para un día de la semana (1 = lunes … 7 = domingo).
 * Las franjas del día se componen con `app-week-schedule-hour-card` vía proyección.
 */
@Component({
  selector: 'app-week-schedule-day-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './week-schedule-day-card.component.html',
  styleUrl: './week-schedule-day-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleDayCardComponent {
  /** Día 1–7 (lunes–domingo), alineado con `WeekSchedule.weekDay` en el front. */
  readonly weekDay = input.required<number>();
  /** Opcional: sufijo estable para `id`/`aria-labelledby` si hay varias tarjetas iguales en pantalla. */
  readonly cardSuffix = input<string | undefined>(undefined);

  readonly dayHeadingId = computed(
    () => `week-schedule-day-${this.weekDay()}-${this.cardSuffix() ?? 'default'}`,
  );

  readonly dayNameTranslateKey = computed(() => `weekScheduleBuilder.days.${this.weekDay()}`);
}
