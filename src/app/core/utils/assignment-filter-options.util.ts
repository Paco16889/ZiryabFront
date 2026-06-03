import { AssignmentWithIncludes } from '../models/assingment';

/** Opción de ciclo para filtros course / group / grade. */
export interface CourseFilterOption {
  id: number;
  name: string;
}

/** Opción de grupo (turno) para filtros. */
export interface GroupFilterOption {
  id: number;
  name: string;
}

/** Valores mínimos para derivar opciones y filtrar (filas agrupadas o assignments). */
export interface AssignmentFilterSource {
  idCourse: number;
  courseName: string;
  idGroup: number;
  groupName: string;
  grade: string;
}

/** Estado de los tres filtros compartidos. */
export interface AssignmentFilterValues {
  courseId: number | null;
  groupId: number | null;
  grade: string | null;
}

/** Ciclos distintos ordenados por nombre. */
export function coursesFromFilterSources(
  items: AssignmentFilterSource[],
): CourseFilterOption[] {
  const map = new Map<number, string>();
  for (const row of items) {
    if (!map.has(row.idCourse)) {
      map.set(row.idCourse, row.courseName);
    }
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Grupos distintos; si hay ciclo seleccionado, solo de ese ciclo. */
export function groupsFromFilterSources(
  items: AssignmentFilterSource[],
  courseId: number | null,
): GroupFilterOption[] {
  const source =
    courseId == null ? items : items.filter((r) => r.idCourse === courseId);
  const map = new Map<number, string>();
  for (const row of source) {
    if (!map.has(row.idGroup)) {
      map.set(row.idGroup, row.groupName);
    }
  }
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Grados distintos; si hay ciclo seleccionado, solo de ese ciclo. */
export function gradesFromFilterSources(
  items: AssignmentFilterSource[],
  courseId: number | null,
): string[] {
  const source =
    courseId == null ? items : items.filter((r) => r.idCourse === courseId);
  return [...new Set(source.map((r) => r.grade))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
}

/** Aplica course + group + grade sobre la fuente de filtro. */
export function matchesAssignmentFilters(
  row: AssignmentFilterSource,
  filters: AssignmentFilterValues,
): boolean {
  if (filters.courseId != null && row.idCourse !== filters.courseId) {
    return false;
  }
  if (filters.groupId != null && row.idGroup !== filters.groupId) {
    return false;
  }
  if (filters.grade != null && row.grade !== filters.grade) {
    return false;
  }
  return true;
}

/** Mapea un assignment con includes a fuente de filtro; null si faltan datos. */
export function assignmentToFilterSource(
  a: AssignmentWithIncludes,
): AssignmentFilterSource | null {
  const courseId = a.subject?.course?.id;
  const courseName = a.subject?.course?.name;
  const groupId = a.group?.id;
  const groupName = a.group?.name;
  const grade = a.subject?.grade;
  if (!courseId || !courseName || !groupId || !groupName || !grade) {
    return null;
  }
  return {
    idCourse: courseId,
    courseName,
    idGroup: groupId,
    groupName,
    grade,
  };
}

/** Assignments del año actual (o todos si no hay ninguno del año). */
export function assignmentsForCurrentSchoolYear(
  items: AssignmentWithIncludes[],
  currentSchoolYear: string,
): AssignmentWithIncludes[] {
  const current = items.filter((a) => a.schoolYear === currentSchoolYear);
  return current.length > 0 ? current : items;
}

/** Etiqueta legible de un assignment para selects. */
export function assignmentOptionLabel(a: AssignmentWithIncludes): string {
  const src = assignmentToFilterSource(a);
  const titular = a.teacher?.name
    ? `${a.teacher.name} ${a.teacher.surname ?? ''}`.trim()
    : '—';
  const subject = a.subject?.name ?? '—';
  const group = a.group?.name ?? '—';
  const course = a.subject?.course?.name ?? '—';
  const grade = src?.grade ?? a.subject?.grade ?? '';
  const gradeLabel = /^\d+$/.test(grade) ? `${grade}º` : grade;
  return `${titular} · ${gradeLabel} · ${subject} · ${group} · ${course}`;
}
