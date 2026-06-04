import type { WeekSchedule } from '../week-schedule';
import type { TeacherSubjectAssignmentRow } from '../teacher/subjectforteacher';
import {
  classHasRemainingSubjectHours,
  dedupeAssignmentRowsBySubject,
  filterTeacherAssignmentsForClass,
} from '../../utils/week-schedule-assignment-filters';

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

/** Franja horaria que pertenece a la clase (por `label` de plantilla o grupo). */
export function scheduleBelongsToClass(
  schedule: WeekSchedule,
  cls: WeekScheduleClassItem,
): boolean {
  const label = schedule.label?.trim();
  if (label && label === cls.label.trim()) {
    return true;
  }
  return schedule.teacherAssignment?.idGroup === cls.group.id;
}

/** Celda de plantilla aún sin docente–asignatura asignado. */
export function isVacantScheduleSlot(schedule: WeekSchedule): boolean {
  const ta = schedule.teacherAssignment;
  return ta == null || ta.id == null;
}

/** Horarios de la clase que siguen en el listado global. */
export function schedulesForClass(
  cls: WeekScheduleClassItem,
  schedules: WeekSchedule[],
): WeekSchedule[] {
  return schedules.filter((s) => scheduleBelongsToClass(s, cls));
}

/** Asignaciones docente de la clase (ciclo + grade + grupo + año). */
export function assignmentRowsForClass(
  cls: WeekScheduleClassItem,
  allAssignments: TeacherSubjectAssignmentRow[],
): TeacherSubjectAssignmentRow[] {
  return dedupeAssignmentRowsBySubject(
    filterTeacherAssignmentsForClass(
      allAssignments,
      cls.course.id,
      cls.grade,
      cls.group.id,
      cls.schoolYear,
    ),
  );
}

/** Rejilla: plantilla creada y alguna asignatura con horas semanales sin cubrir. */
export function isWeekScheduleClassEligibleForGridSelector(
  c: WeekScheduleClassItem,
  schedules: WeekSchedule[],
  allAssignments: TeacherSubjectAssignmentRow[],
): boolean {
  if (c.subjectCount <= 0) {
    return false;
  }
  const classSchedules = schedulesForClass(c, schedules);
  if (classSchedules.length === 0) {
    return false;
  }
  const rows = assignmentRowsForClass(c, allAssignments);
  return classHasRemainingSubjectHours(classSchedules, rows);
}
