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
