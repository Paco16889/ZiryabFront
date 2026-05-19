import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import {
  isValidHhMmTime,
  normalizeHhMmTime,
  timeToMinutes,
} from '../../../../../core/utils/time-range';

/** Una franja horaria de la plantilla (inicio–fin en `HH:mm`). */
export interface WeekScheduleCreateSlotRow {
  startTime: string;
  finishTime: string;
}

const firstCenterSlot = environment.timetableSlots[0];
const DEFAULT_SLOT_ROW: WeekScheduleCreateSlotRow = {
  startTime: firstCenterSlot?.startTime ?? '08:15',
  finishTime: firstCenterSlot?.finishTime ?? '09:15',
};

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
  readonly slots = input<WeekScheduleCreateSlotRow[]>([{ ...DEFAULT_SLOT_ROW }]);
  readonly showValidation = input(false);
  readonly disabled = input(false);

  readonly slotsChange = output<WeekScheduleCreateSlotRow[]>();

  readonly timePlaceholder = '08:15';

  slotCount(): number {
    return this.slots().length;
  }

  onSlotCountChange(raw: string): void {
    if (this.disabled()) {
      return;
    }
    const count = Math.max(1, Math.floor(Number(raw)) || 1);
    const next = [...this.slots()];
    while (next.length < count) {
      next.push({ ...DEFAULT_SLOT_ROW });
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
