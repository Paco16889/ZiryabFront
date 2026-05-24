import { AssignmentStatus } from '../models/assingment';
import { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';
import { hoursBetween } from './time-range';

/** Celda mínima para contar horas ya asignadas a una asignatura en la rejilla. */
export interface WeekScheduleGridCellHoursSlice {
  idSubject?: number;
  idTeacherAssignment?: number;
  startTime: string;
  finishTime: string;
}

/**
 * @file Filtros sobre filas **TeacherOnSubjectOnGroup** (`TeacherSubjectAssignmentRow`) para el builder de horarios.
 *
 * El listado crudo del API puede traer asignaciones no impartibles; aquí se decide qué filas son válidas
 * para ofrecer en el desplegable de una franja (p. ej. solo `ACTIVE` y del curso escolar elegido).
 */

/**
 * Comprueba si una fila de asignación docente puede usarse al **montar horarios** (está “schedulable”).
 *
 * - Si `status` viene vacío o `null` (API antigua o sin campo), se considera **válida** (`true`).
 * - Se aceptan **`ACTIVE`** y **`STANDBY`** (el seed y el alta en admin usan STANDBY hasta activar).
 *
 * @param row - Fila `TeacherSubjectAssignmentRow` devuelta por el API.
 * @returns `true` si se puede ofrecer en el constructor de horarios; si no, `false`.
 *
 * @example
 * // Profesor activo en la asignatura
 * isTeacherAssignmentRowSchedulable({ ...row, status: AssignmentStatus.ACTIVE }); // → true
 *
 * @example
 * // Baja médica: no se ofrece en el builder
 * isTeacherAssignmentRowSchedulable({ ...row, status: AssignmentStatus.ILLNESS }); // → false
 *
 * @example
 * // API sin campo status: se asume usable
 * isTeacherAssignmentRowSchedulable({ ...row, status: undefined }); // → true
 */
export function isTeacherAssignmentRowSchedulable(
  row: TeacherSubjectAssignmentRow,
): boolean {
  if (row.status == null || row.status === '') {
    return true;
  }
  return (
    row.status === AssignmentStatus.ACTIVE || row.status === AssignmentStatus.STANDBY
  );
}

/**
 * Deja solo las asignaciones del **año académico** indicado y que pasen {@link isTeacherAssignmentRowSchedulable}.
 *
 * Las filas deberían estar ya filtradas por grupo (p. ej. `idGroup`) antes de llamar a esta función;
 * aquí no se filtra por grupo, solo por `schoolYear` y estado impartible.
 *
 * @param rows - Listado de asignaciones docente–asignatura–grupo.
 * @param schoolYear - Curso escolar, p. ej. `'2024-2025'`.
 * @returns Nuevo array solo con filas del año dado y schedulables.
 *
 * @example
 * const rows = [
 *   { id: 1, schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE, ... },
 *   { id: 2, schoolYear: '2023-2024', status: AssignmentStatus.ACTIVE, ... },
 * ];
 * filterTeacherAssignmentsForSchoolYear(rows, '2024-2025');
 * // → solo la fila con id 1
 *
 * @example
 * // Mezcla ACTIVE y STANDBY en el mismo año: solo queda ACTIVE
 * filterTeacherAssignmentsForSchoolYear(
 *   [
 *     { schoolYear: '2024-2025', status: AssignmentStatus.ACTIVE, ... },
 *     { schoolYear: '2024-2025', status: AssignmentStatus.STANDBY, ... },
 *   ],
 *   '2024-2025',
 * );
 * // → un elemento
 */
export function filterTeacherAssignmentsForSchoolYear(
  rows: TeacherSubjectAssignmentRow[],
  schoolYear: string,
): TeacherSubjectAssignmentRow[] {
  return rows.filter(
    (r) => r.schoolYear === schoolYear && isTeacherAssignmentRowSchedulable(r),
  );
}

/** Normaliza curso académico para comparar (`1º` ↔ `1`). */
export function normalizeGradeValue(grade: string): string {
  return grade.replace(/º/g, '').trim();
}

/** Ciclo y curso (grade) de la asignatura anidada; el API puede enviar `course.id` o `idCourse`. */
export function subjectMatchesClass(
  row: TeacherSubjectAssignmentRow,
  courseId: number,
  grade: string,
): boolean {
  const sub = row.subject;
  if (!sub) {
    return false;
  }
  const cid = sub.course?.id ?? (sub as { idCourse?: number }).idCourse;
  if (cid !== courseId) {
    return false;
  }
  return normalizeGradeValue(sub.grade ?? '') === normalizeGradeValue(grade);
}

/**
 * Filas de una **clase** agregada: mismo ciclo, grade, grupo y año escolar.
 */
export function filterTeacherAssignmentsForClass(
  rows: TeacherSubjectAssignmentRow[],
  courseId: number,
  grade: string,
  groupId: number,
  schoolYear: string,
): TeacherSubjectAssignmentRow[] {
  return filterTeacherAssignmentsForSchoolYear(rows, schoolYear).filter(
    (r) => r.idGroup === groupId && subjectMatchesClass(r, courseId, grade),
  );
}

/** Elimina filas duplicadas por `id` de assignment. */
export function dedupeAssignmentRowsById(
  rows: TeacherSubjectAssignmentRow[],
): TeacherSubjectAssignmentRow[] {
  const seen = new Map<number, TeacherSubjectAssignmentRow>();
  for (const row of rows) {
    if (!seen.has(row.id)) {
      seen.set(row.id, row);
    }
  }
  return [...seen.values()];
}

/**
 * Una sola opción por asignatura (`idSubject`) en cada desplegable.
 * Si hay varios assignments para el mismo Fach, conserva `preferAssignmentId` o el de menor `id`.
 */
export function dedupeAssignmentRowsBySubject(
  rows: TeacherSubjectAssignmentRow[],
  preferAssignmentId: number | null = null,
): TeacherSubjectAssignmentRow[] {
  const bySubject = new Map<number, TeacherSubjectAssignmentRow>();
  for (const row of rows) {
    const sid = row.idSubject;
    const existing = bySubject.get(sid);
    if (!existing) {
      bySubject.set(sid, row);
      continue;
    }
    if (row.id === preferAssignmentId) {
      bySubject.set(sid, row);
    } else if (
      preferAssignmentId == null &&
      existing.id !== preferAssignmentId &&
      row.id < existing.id
    ) {
      bySubject.set(sid, row);
    }
  }
  return [...bySubject.values()];
}

/**
 * Opciones del desplegable de una celda: todas las asignaturas del ciclo+grade de la clase
 * que aún tienen horas libres (`subject.hours` menos franjas ya asignadas).
 */
export function filterAssignmentOptionsForCellBySubjectHours(
  options: TeacherSubjectAssignmentRow[],
  cells: Map<string, WeekScheduleGridCellHoursSlice>,
  cellKey: string,
): TeacherSubjectAssignmentRow[] {
  const current = cells.get(cellKey);
  const currentSubjectId = current?.idSubject ?? null;

  return options.filter((row) => {
    if (currentSubjectId != null && row.idSubject === currentSubjectId) {
      return true;
    }
    const declared = row.subject?.hours;
    if (declared == null || declared <= 0) {
      return false;
    }
    let used = 0;
    for (const [key, cell] of cells) {
      if (key === cellKey) {
        continue;
      }
      if (cell.idSubject === row.idSubject && cell.idTeacherAssignment != null) {
        used += hoursBetween(cell.startTime, cell.finishTime);
      }
    }
    return used < declared - 1e-6;
  });
}

/** Comprueba si colocar `row` en la celda superaría las horas semanales de la asignatura. */
export function wouldExceedSubjectHoursInCell(
  row: TeacherSubjectAssignmentRow,
  cells: Map<string, WeekScheduleGridCellHoursSlice>,
  cellKey: string,
  slotStart: string,
  slotFinish: string,
): boolean {
  const declared = row.subject?.hours;
  if (declared == null || declared <= 0) {
    return false;
  }
  let used = 0;
  for (const [key, cell] of cells) {
    if (key === cellKey) {
      continue;
    }
    if (cell.idSubject === row.idSubject && cell.idTeacherAssignment != null) {
      used += hoursBetween(cell.startTime, cell.finishTime);
    }
  }
  return used + hoursBetween(slotStart, slotFinish) > declared + 1e-6;
}
