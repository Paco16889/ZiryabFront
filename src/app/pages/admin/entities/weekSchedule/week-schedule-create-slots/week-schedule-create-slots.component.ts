import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isValidHhMmTime, normalizeHhMmTime, timeToMinutes } from '../../../../../core/utils/time-range';
import {
  defaultWeekScheduleSlotRow,
  nextWeekScheduleSlotRow,
  weekScheduleSlotStartPlaceholder,
} from './week-schedule-create-slots.util';

/** Una franja horaria de la plantilla (inicio–fin en `HH:mm`). */
export interface WeekScheduleCreateSlotRow {
  startTime: string;
  finishTime: string;
}

/**
 * Número de franjas y filas dinámicas inicio/fin para la plantilla horaria.
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-90
 */
@Component({
  selector: 'app-week-schedule-create-slots',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './week-schedule-create-slots.component.html',
  styleUrl: './week-schedule-create-slots.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleCreateSlotsComponent {
  readonly slots = input<WeekScheduleCreateSlotRow[]>([defaultWeekScheduleSlotRow()]);
  readonly showValidation = input(false);
  readonly disabled = input(false);
  /** Máximo de filas de franja (horas semanales ÷ días seleccionados). */
  readonly maxSlots = input<number | null>(null);
  readonly weeklyHoursTotal = input<number | null>(null);
  readonly selectedDayCount = input(0);

  readonly slotsChange = output<WeekScheduleCreateSlotRow[]>();

  slotCount(): number {
    return this.slots().length;
  }

  effectiveMaxSlots(): number | null {
    const max = this.maxSlots();
    return max != null && max > 0 ? max : null;
  }

  isAtMaxSlots(): boolean {
    const max = this.effectiveMaxSlots();
    return max != null && this.slots().length >= max;
  }

  startPlaceholder(index: number): string {
    return weekScheduleSlotStartPlaceholder(this.slots(), index);
  }

  onSlotCountChange(raw: string): void {
    if (this.disabled()) {
      return;
    }
    let count = Math.max(1, Math.floor(Number(raw)) || 1);
    const max = this.effectiveMaxSlots();
    if (max != null) {
      count = Math.min(count, max);
    }
    const next = [...this.slots()];
    while (next.length < count) {
      next.push(nextWeekScheduleSlotRow(next));
    }
    while (next.length > count) {
      next.pop();
    }
    this.slotsChange.emit(next);
  }

  onSlotTimeInput(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const next = this.slots().map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    this.slotsChange.emit(next);
  }

  onSlotTimeBlur(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const normalized = normalizeHhMmTime(value);
    if (normalized && normalized !== value) {
      this.onSlotTimeInput(index, field, normalized);
    }
  }

  isFieldFormatInvalid(value: string): boolean {
    return !isValidHhMmTime(value.trim());
  }

  isRowFormatInvalid(row: WeekScheduleCreateSlotRow): boolean {
    return (
      this.isFieldFormatInvalid(row.startTime) || this.isFieldFormatInvalid(row.finishTime)
    );
  }

  isRowTimeOrderInvalid(row: WeekScheduleCreateSlotRow): boolean {
    if (!isValidHhMmTime(row.startTime) || !isValidHhMmTime(row.finishTime)) {
      return false;
    }
    return timeToMinutes(row.startTime) >= timeToMinutes(row.finishTime);
  }

  hasInvalidSlots(): boolean {
    return this.slots().some(
      (row) => this.isRowFormatInvalid(row) || this.isRowTimeOrderInvalid(row),
    );
  }
}
