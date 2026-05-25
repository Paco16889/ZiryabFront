import { normalizeGradeValue } from './week-schedule-assignment-filters';

/** Clave estable de clase agregada sin cargar el item completo del API. */
export function weekScheduleClassKeyFromParts(
  courseId: number,
  grade: string,
  groupId: number,
  schoolYear: string,
): string {
  return `${courseId}|${normalizeGradeValue(grade)}|${groupId}|${schoolYear}`;
}
