import type { WeekSchedule } from '../week-schedule';

/** Referencia mínima a ciclo formativo en listado de clases para horarios. */
export interface WeekScheduleClassCourseRef {
  /** Identificador del ciclo/curso en el backend. */
  id: number;

  /** Nombre del ciclo que se muestra en el selector de clases. */
  name: string;
}

/** Referencia mínima a grupo en listado de clases para horarios. */
export interface WeekScheduleClassGroupRef {
  /** Identificador del grupo académico. */
  id: number;

  /** Nombre corto del grupo usado en la etiqueta de clase. */
  name: string;
}

/**
 * Clase agregada para el selector del builder: `(course, grade, group, schoolYear)`.
 * `label` lo compone el backend (`{grade} {course.name} — {group.name}`).
 */
export interface WeekScheduleClassItem {
  /** Etiqueta ya compuesta para mostrar en el selector del builder. */
  label: string;

  /** Curso/nivel dentro del ciclo, necesario para filtrar asignaturas compatibles. */
  grade: string;

  /** Ciclo formativo al que pertenece la clase agregada. */
  course: WeekScheduleClassCourseRef;

  /** Grupo sobre el que se generará o editará el horario. */
  group: WeekScheduleClassGroupRef;

  /** Año escolar de la clase agregada. */
  schoolYear: string;

  /** Número de asignaturas con oferta docente detectadas para la clase. */
  subjectCount: number;

  /** Indica si ya existe una plantilla horaria para evitar duplicados en la pestaña de creación. */
  hasWeekSchedule: boolean;
}

/** Respuesta de `GET /api/horarios-semanales/classes`. */
export interface WeekScheduleClassesResponse {
  /** Indica si el backend pudo construir el listado de clases agregadas. */
  success: boolean;

  /** Total de clases agregadas devueltas. */
  count: number;

  /** Clases disponibles para el builder de horarios. */
  data: WeekScheduleClassItem[];
}

/** Clave estable de clase agregada para `<select>` y mapas en memoria. */
export function weekScheduleClassKey(c: WeekScheduleClassItem): string {
  return `${c.course.id}|${c.grade}|${c.group.id}|${c.schoolYear}`;
}

/** Clases elegibles en Crear plantilla (`GET` con `hasWeekSchedule=false`). */
export function isWeekScheduleClassEligibleForCreateTemplate(c: WeekScheduleClassItem): boolean {
  return c.subjectCount > 0 && c.hasWeekSchedule === false;
}

/** Plantilla con al menos una franja sin `teacherAssignment` (rejilla: celdas libres). */
export function classHasVacantScheduleSlots(
  cls: WeekScheduleClassItem,
  schedules: WeekSchedule[],
): boolean {
  return schedules.some(
    (s) => s.label === cls.label && s.teacherAssignment == null,
  );
}

/** Rejilla: clases con plantilla y franjas vacías por asignar. */
export function isWeekScheduleClassEligibleForGridSelector(
  c: WeekScheduleClassItem,
  schedules: WeekSchedule[],
): boolean {
  return c.subjectCount > 0 && classHasVacantScheduleSlots(c, schedules);
}
