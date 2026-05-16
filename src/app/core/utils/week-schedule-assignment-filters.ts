import { AssignmentStatus } from '../models/assingment';
import { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';

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
 * - Solo se acepta explícitamente estado **`ACTIVE`** como impartible.
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
  return row.status === AssignmentStatus.ACTIVE;
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
