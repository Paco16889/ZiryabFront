import type { TimetableSlot } from '../models/timetable-slot';
import type { WeekSchedule } from '../models/week-schedule';
import { timeToMinutes } from './time-range';

/** Días y franjas de la rejilla según la plantilla materializada en BD. */
export function gridLayoutFromWeekSchedules(schedules: WeekSchedule[]): {
  weekDays: number[];
  slots: TimetableSlot[];
} {
  if (!schedules.length) {
    return { weekDays: [], slots: [] };
  }

  const weekDays = [...new Set(schedules.map((s) => Number(s.weekDay)))].sort((a, b) => a - b);

  const slotByStart = new Map<string, TimetableSlot>();
  for (const s of schedules) {
    slotByStart.set(s.startTime, { startTime: s.startTime, finishTime: s.finishTime });
  }
  const slots = [...slotByStart.values()].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  return { weekDays, slots };
}
