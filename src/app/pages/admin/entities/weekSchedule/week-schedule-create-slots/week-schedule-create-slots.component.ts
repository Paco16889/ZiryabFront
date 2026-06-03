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
  /** Hora de inicio (`HH:mm`). */
  startTime: string;

  /** Hora de fin (`HH:mm`). */
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
  /** Franjas horarias editables de la plantilla. */
  readonly slots = input<WeekScheduleCreateSlotRow[]>([defaultWeekScheduleSlotRow()]);

  /** Muestra errores de validación en plantilla. */
  readonly showValidation = input(false);

  /** Bloquea edición de franjas. */
  readonly disabled = input(false);

  /** Máximo de filas de franja (horas semanales ÷ días seleccionados). */
  readonly maxSlots = input<number | null>(null);

  /** Horas semanales del centro para calcular `maxSlots`. */
  readonly weeklyHoursTotal = input<number | null>(null);

  /** Días laborables seleccionados en la plantilla. */
  readonly selectedDayCount = input(0);

  /** Emite el array de franjas cuando el usuario edita filas u horas. */
  readonly slotsChange = output<WeekScheduleCreateSlotRow[]>();

  /** Número actual de filas de franja. */
  slotCount(): number {
    return this.slots().length;
  }

  /** Máximo de franjas permitido según horas semanales y días. */
  effectiveMaxSlots(): number | null {
    const max = this.maxSlots();
    return max != null && max > 0 ? max : null;
  }

  /** Indica si no se pueden añadir más franjas. */
  isAtMaxSlots(): boolean {
    const max = this.effectiveMaxSlots();
    return max != null && this.slots().length >= max;
  }

  /** Placeholder de inicio sugerido para la fila `index`. */
  startPlaceholder(index: number): string {
    return weekScheduleSlotStartPlaceholder(this.slots(), index);
  }

  /** Ajusta el número de filas de franja (añadir o quitar). */
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

  /** Actualiza inicio o fin de una franja mientras se escribe. */
  onSlotTimeInput(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const next = this.slots().map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    this.slotsChange.emit(next);
  }

  /** Normaliza formato `HH:mm` al salir del campo. */
  onSlotTimeBlur(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const normalized = normalizeHhMmTime(value);
    if (normalized && normalized !== value) {
      this.onSlotTimeInput(index, field, normalized);
    }
  }

  /** `true` si el texto no es una hora `HH:mm` válida. */
  isFieldFormatInvalid(value: string): boolean {
    return !isValidHhMmTime(value.trim());
  }

  /** Valida formato de inicio y fin de una fila. */
  isRowFormatInvalid(row: WeekScheduleCreateSlotRow): boolean {
    return (
      this.isFieldFormatInvalid(row.startTime) || this.isFieldFormatInvalid(row.finishTime)
    );
  }

  /** `true` si la hora de fin no es posterior al inicio. */
  isRowTimeOrderInvalid(row: WeekScheduleCreateSlotRow): boolean {
    if (!isValidHhMmTime(row.startTime) || !isValidHhMmTime(row.finishTime)) {
      return false;
    }
    return timeToMinutes(row.startTime) >= timeToMinutes(row.finishTime);
  }

  /** Indica si alguna franja tiene error de formato u orden. */
  hasInvalidSlots(): boolean {
    return this.slots().some(
      (row) => this.isRowFormatInvalid(row) || this.isRowTimeOrderInvalid(row),
    );
  }
}
