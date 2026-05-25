import { environment } from '../../../../../../environments/environment';
import {
  addMinutesToTime,
  isValidHhMmTime,
  slotDurationMinutes,
} from '../../../../../core/utils/time-range';
import type { WeekScheduleCreateSlotRow } from './week-schedule-create-slots.component';

const firstCenterSlot = environment.timetableSlots[0];

export function defaultWeekScheduleSlotRow(): WeekScheduleCreateSlotRow {
  return {
    startTime: firstCenterSlot?.startTime ?? '08:15',
    finishTime: firstCenterSlot?.finishTime ?? '09:15',
  };
}

/** Placeholder de inicio para la franja `index` (incremental desde la anterior). */
export function weekScheduleSlotStartPlaceholder(
  slots: WeekScheduleCreateSlotRow[],
  index: number,
): string {
  if (index <= 0) {
    return firstCenterSlot?.startTime ?? '08:15';
  }
  const prev = slots[index - 1];
  if (isValidFinishForChain(prev.finishTime)) {
    return prev.finishTime;
  }
  return firstCenterSlot?.startTime ?? '08:15';
}

/** Nueva fila sugerida encadenada tras la anterior o la franja inicial del centro. */
export function nextWeekScheduleSlotRow(
  slots: WeekScheduleCreateSlotRow[],
): WeekScheduleCreateSlotRow {
  if (slots.length === 0) {
    return defaultWeekScheduleSlotRow();
  }
  const prev = slots[slots.length - 1];
  const startTime = weekScheduleSlotStartPlaceholder(slots, slots.length);
  const duration = slotDurationMinutes(prev.startTime, prev.finishTime);
  return {
    startTime,
    finishTime: addMinutesToTime(startTime, duration),
  };
}

function isValidFinishForChain(finishTime: string): boolean {
  return isValidHhMmTime(finishTime.trim());
}

/**
 * Máximo de filas de franja en la plantilla.
 * Cada fila se repite en todos los días elegidos; si las horas no dividen exactamente
 * entre los días (p. ej. 6 h ÷ 5 días), se permite una franja extra (techo, no suelo).
 *
 * TODO [EQ-307]: la materialización duplica cada fila en todos los días y puede crear
 * más franjas semanales de las necesarias; pendiente de refinar (ver comentario EQ-309).
 */
export function maxSlotRowsForTemplate(
  weeklyHoursTotal: number,
  selectedDayCount: number,
): number | null {
  if (weeklyHoursTotal <= 0 || selectedDayCount <= 0) {
    return null;
  }
  return Math.max(1, Math.ceil(weeklyHoursTotal / selectedDayCount));
}
