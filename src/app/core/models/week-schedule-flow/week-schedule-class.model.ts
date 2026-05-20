/** Referencia mínima a ciclo formativo en listado de clases para horarios. */
export interface WeekScheduleClassCourseRef {
  id: number;
  name: string;
}

/** Referencia mínima a grupo en listado de clases para horarios. */
export interface WeekScheduleClassGroupRef {
  id: number;
  name: string;
}

/**
 * Clase agregada para el selector del builder: `(course, grade, group, schoolYear)`.
 * `label` lo compone el backend (`{grade} {course.name} — {group.name}`).
 */
export interface WeekScheduleClassItem {
  label: string;
  grade: string;
  course: WeekScheduleClassCourseRef;
  group: WeekScheduleClassGroupRef;
  schoolYear: string;
  subjectCount: number;
  hasWeekSchedule: boolean;
}

/** Respuesta de `GET /api/horarios-semanales/classes`. */
export interface WeekScheduleClassesResponse {
  success: boolean;
  count: number;
  data: WeekScheduleClassItem[];
}

/** Clave estable de clase agregada para `<select>` y mapas en memoria. */
export function weekScheduleClassKey(c: WeekScheduleClassItem): string {
  return `${c.course.id}|${c.grade}|${c.group.id}|${c.schoolYear}`;
}

/** Clases con oferta docente y sin plantilla horaria creada (pestaña Crear plantilla). */
export function isWeekScheduleClassEligibleForCreateTemplate(c: WeekScheduleClassItem): boolean {
  return c.subjectCount > 0 && !c.hasWeekSchedule;
}
