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
  /** Hora de inicio de la franja en formato estricto `HH:mm`. */
  startTime: string;

  /** Hora final de la franja en formato estricto `HH:mm`. */
  finishTime: string;
}

/** Primera franja configurada para el centro, usada al añadir filas nuevas. */
const firstCenterSlot = environment.timetableSlots[0];

/** Fila base para mantener una hora inicial válida antes de que el usuario edite. */
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
  /** Lista de franjas controlada por el componente padre. */
  readonly slots = input<WeekScheduleCreateSlotRow[]>([{ ...DEFAULT_SLOT_ROW }]);

  /** Activa los mensajes visuales cuando el padre ya intentó enviar el formulario. */
  readonly showValidation = input(false);

  /** Bloquea cambios mientras la plantilla no debe editarse o se está enviando. */
  readonly disabled = input(false);

  /** Emite una copia completa de las franjas cada vez que cambia cantidad u horas. */
  readonly slotsChange = output<WeekScheduleCreateSlotRow[]>();

  /** Placeholder que enseña el formato de hora exigido por las validaciones. */
  readonly timePlaceholder = '08:15';

  /** Número actual de franjas que se muestra en el selector de cantidad. */
  slotCount(): number {
    return this.slots().length;
  }

  /**
   * Ajusta el tamaño de la lista de franjas sin mutar el input original:
   * añade filas con la franja base o elimina desde el final.
   */
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

  /** Actualiza una celda concreta de hora y emite la lista completa al padre. */
  onSlotTimeInput(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const next = this.slots().map((row, i) =>
      i === index ? { ...row, [field]: value } : row,
    );
    this.slotsChange.emit(next);
  }

  /**
   * Normaliza la hora al perder foco solo si el valor sigue siendo `HH:mm` válido;
   * los valores inválidos se mantienen para que el usuario vea y corrija el error.
   */
  onSlotTimeBlur(index: number, field: keyof WeekScheduleCreateSlotRow, value: string): void {
    if (this.disabled()) {
      return;
    }
    const normalized = normalizeHhMmTime(value);
    if (normalized && normalized !== value) {
      this.onSlotTimeInput(index, field, normalized);
    }
  }

  /** Comprueba si un campo individual incumple el formato `HH:mm`. */
  isFieldFormatInvalid(value: string): boolean {
    return !isValidHhMmTime(value.trim());
  }

  /** Indica si inicio o fin de una fila tienen formato horario inválido. */
  isRowFormatInvalid(row: WeekScheduleCreateSlotRow): boolean {
    return (
      this.isFieldFormatInvalid(row.startTime) || this.isFieldFormatInvalid(row.finishTime)
    );
  }

  /** Detecta franjas donde el fin no es posterior al inicio. */
  isRowTimeOrderInvalid(row: WeekScheduleCreateSlotRow): boolean {
    if (!isValidHhMmTime(row.startTime) || !isValidHhMmTime(row.finishTime)) {
      return false;
    }
    return timeToMinutes(row.startTime) >= timeToMinutes(row.finishTime);
  }

  /** Resume si hay cualquier franja inválida para bloquear el envío del padre. */
  hasInvalidSlots(): boolean {
    return this.slots().some(
      (row) => this.isRowFormatInvalid(row) || this.isRowTimeOrderInvalid(row),
    );
  }
}
