import { AssignmentStatus, AssignmentWithIncludes } from '../models/assingment';

/** Carga docente agregada para el selector del grid de asignaciones. */
export interface TeacherAssignmentLoad {
  weeklyHours: number;
  assignmentCount: number;
}

/** Id del profesor en la fila de assignment del API. */
export function courseAssignmentTeacherId(a: AssignmentWithIncludes): number | undefined {
  const id = a.idTeacher ?? a.teacher?.id;
  if (id == null || Number.isNaN(Number(id))) {
    return undefined;
  }
  return Number(id);
}

/** Imparticiones que suman horas (ACTIVE, STANDBY o sin estado). */
export function courseAssignmentCountsForLoad(a: AssignmentWithIncludes): boolean {
  if (a.status == null) {
    return true;
  }
  const s = String(a.status).toUpperCase();
  return s === AssignmentStatus.ACTIVE || s === AssignmentStatus.STANDBY;
}

/**
 * Suma horas e imparticiones por `idTeacher` a partir del listado de assignments.
 * Usar el mismo array que devuelve `GET /api/assignments` (como en sustituciones).
 */
export function buildTeacherAssignmentLoadMap(
  assignments: AssignmentWithIncludes[],
): Map<number, TeacherAssignmentLoad> {
  const map = new Map<number, TeacherAssignmentLoad>();
  for (const a of assignments) {
    const teacherId = courseAssignmentTeacherId(a);
    if (teacherId == null || !courseAssignmentCountsForLoad(a)) {
      continue;
    }
    const hours = Number(a.subject?.hours ?? 0);
    const prev = map.get(teacherId) ?? { weeklyHours: 0, assignmentCount: 0 };
    map.set(teacherId, {
      weeklyHours: prev.weeklyHours + hours,
      assignmentCount: prev.assignmentCount + 1,
    });
  }
  return map;
}

export function isTeacherWithinLoadLimits(
  load: TeacherAssignmentLoad,
  maxWeeklyHours: number,
  maxActiveAssignments: number,
): boolean {
  return load.assignmentCount <= maxActiveAssignments && load.weeklyHours <= maxWeeklyHours;
}

/** Grid de asignaciones de ciclo: solo tope de horas (puede tener varias imparticiones si suman ≤ máximo). */
export function isTeacherWithinWeeklyHoursLimit(
  load: TeacherAssignmentLoad,
  maxWeeklyHours: number,
): boolean {
  return load.weeklyHours <= maxWeeklyHours;
}

/** Profesores que aparecen como `idTeacher` / `teacher.id` en algún assignment del listado. */
export function collectAssignedTeacherIds(
  assignments: AssignmentWithIncludes[],
): Set<number> {
  const ids = new Set<number>();
  for (const a of assignments) {
    const id = courseAssignmentTeacherId(a);
    if (id != null) {
      ids.add(id);
    }
  }
  return ids;
}

/**
 * Elegible en el grid de asignaciones de ciclo:
 * - sin ninguna impartición en el API, o
 * - con imparticiones y suma de horas ≤ tope (solo ACTIVE/STANDBY cuentan horas).
 */
export function isEligibleForCourseAssignmentTeacherPicker(
  teacherId: number,
  assignedTeacherIds: Set<number>,
  loadMap: Map<number, TeacherAssignmentLoad>,
  maxWeeklyHours: number,
): boolean {
  if (!assignedTeacherIds.has(teacherId)) {
    return true;
  }
  const load = loadMap.get(teacherId) ?? { weeklyHours: 0, assignmentCount: 0 };
  return isTeacherWithinWeeklyHoursLimit(load, maxWeeklyHours);
}

/** Normaliza la respuesta de GET /api/assignments (con o sin `success`). */
export function parseAssignmentsListResponse(body: unknown): AssignmentWithIncludes[] {
  if (body == null) {
    return [];
  }
  if (Array.isArray(body)) {
    return body as AssignmentWithIncludes[];
  }
  if (typeof body !== 'object') {
    return [];
  }
  const record = body as Record<string, unknown>;
  const data = record['data'];
  if (Array.isArray(data)) {
    return data as AssignmentWithIncludes[];
  }
  return [];
}
