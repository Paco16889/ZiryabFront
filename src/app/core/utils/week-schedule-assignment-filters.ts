import { AssignmentStatus } from '../models/assingment';
import { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';

/**
 * Comprueba si una fila de asignación docente puede usarse al **montar horarios** (está “schedulable”).
 *
 * - Si `status` viene vacío o `null` (API antigua o sin campo), se considera **válida** (`true`).
 * - Solo se acepta explícitamente estado **`ACTIVE`** como impartible.
 *
 * @param row Fila `TeacherSubjectAssignmentRow` devuelta por el API.
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
 * @param rows Listado de asignaciones docente–asignatura–grupo.
 * @param schoolYear Curso escolar, p. ej. `'2024-2025'`.
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

/**
 * Normaliza curso académico para comparar (`1º` ↔ `1`).
 *
 * @param grade Grade recibido desde asignatura o selector.
 * @returns Grade sin símbolo ordinal y sin espacios.
 */
function normalizeGradeValue(grade: string): string {
  return grade.replace(/º/g, '').trim();
}

/**
 * Filas de una **clase** agregada: mismo ciclo, grade, grupo y año escolar.
 *
 * @param rows Asignaciones candidatas ya devueltas por el API.
 * @param courseId Ciclo seleccionado en el builder.
 * @param grade Curso/nivel de la clase agregada.
 * @param groupId Grupo seleccionado.
 * @param schoolYear Curso escolar activo.
 * @returns Asignaciones compatibles con esa clase.
 */
export function filterTeacherAssignmentsForClass(
  rows: TeacherSubjectAssignmentRow[],
  courseId: number,
  grade: string,
  groupId: number,
  schoolYear: string,
): TeacherSubjectAssignmentRow[] {
  const targetGrade = normalizeGradeValue(grade);
  return filterTeacherAssignmentsForSchoolYear(rows, schoolYear).filter(
    (r) =>
      r.idGroup === groupId &&
      r.subject?.course?.id === courseId &&
      normalizeGradeValue(r.subject?.grade ?? '') === targetGrade,
  );
}
