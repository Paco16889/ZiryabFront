import { ClassSession } from '../models/class-sessions';
import { prismaDayOfWeekToNumber } from './week-day';

/** Filtros del listado admin de sesiones (sin datos anidados de assignment en el GET). */
export interface ClassSessionListFilters {
  dateFrom: string | null;
  dateTo: string | null;
  weekDay: number | null;
  status: string | null;
}

/** Fecha de sesión en `YYYY-MM-DD` (ignora hora ISO). */
export function classSessionDateOnly(date: string | undefined): string {
  if (!date) {
    return '';
  }
  return date.split('T')[0];
}

/** Día de la semana de la franja (1 = lunes … 7 = domingo). */
export function classSessionWeekDay(session: ClassSession): number | null {
  const raw = session.schedule?.weekDay;
  if (raw == null || raw === '') {
    return null;
  }
  return prismaDayOfWeekToNumber(raw as string | number);
}

/** Aplica filtros por fecha, día de franja y estado. */
export function matchesClassSessionFilters(
  session: ClassSession,
  filters: ClassSessionListFilters,
): boolean {
  if (filters.status != null && session.status !== filters.status) {
    return false;
  }
  if (filters.weekDay != null) {
    const wd = classSessionWeekDay(session);
    if (wd !== filters.weekDay) {
      return false;
    }
  }
  const sessionDate = classSessionDateOnly(session.date);
  if (filters.dateFrom && sessionDate && sessionDate < filters.dateFrom) {
    return false;
  }
  if (filters.dateTo && sessionDate && sessionDate > filters.dateTo) {
    return false;
  }
  return true;
}

/** Días de la semana presentes en las sesiones cargadas (ordenados). */
export function weekDaysFromClassSessions(sessions: ClassSession[]): number[] {
  const set = new Set<number>();
  for (const s of sessions) {
    const wd = classSessionWeekDay(s);
    if (wd != null) {
      set.add(wd);
    }
  }
  return [...set].sort((a, b) => a - b);
}

/** Estados distintos en el listado. */
export function statusesFromClassSessions(sessions: ClassSession[]): string[] {
  return [...new Set(sessions.map((s) => s.status).filter(Boolean))].sort();
}
