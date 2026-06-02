import { AssignmentSubstitution } from '../models/assignment-substitution';
import {
  AssignmentStatus,
  AssignmentWithIncludes,
  AssignmentsWithIncludesResponse,
} from '../models/assingment';

/** Umbrales para considerar a un profesor disponible como sustituto. */
export interface SubstituteEligibilityThresholds {
  /** Horas semanales máximas en imparticiones ACTIVE propias. */
  maxWeeklyHours: number;
  /** Imparticiones ACTIVE propias en el año académico. */
  maxActiveAssignments: number;
}

/** Carga docente efectiva para decidir si puede asumir otra sustitución. */
export interface TeacherTeachingLoad {
  /** Imparticiones ACTIVE a su nombre. */
  ownAssignmentCount: number;
  /** Horas de esas imparticiones. */
  ownWeeklyHours: number;
  /** Sustituciones activas donde es sustituto (`idSubstitute`). */
  activeSubstituteSlots: number;
  /** Horas de las clases que está cubriendo como sustituto. */
  substituteCoverWeeklyHours: number;
  activeAssignmentCount: number;
  weeklyHours: number;
}

type AssignmentTeacherIdSource = AssignmentWithIncludes & {
  teacherId?: number;
  id_teacher?: number;
};

/** Id del profesor en una impartición (varios nombres que devuelve el API). */
export function resolveAssignmentTeacherId(a: AssignmentWithIncludes): number | undefined {
  const raw = a as AssignmentTeacherIdSource;
  const id = raw.idTeacher ?? raw.teacherId ?? raw.id_teacher ?? raw.teacher?.id;
  return id != null && !Number.isNaN(Number(id)) ? Number(id) : undefined;
}

/**
 * Imparticiones que cuentan para carga: igual que el builder de horarios
 * (`ACTIVE`, `STANDBY` o sin estado). Solo ACTIVE hacía que todos salieran con 0 h.
 */
export function countsTowardTeacherLoad(a: AssignmentWithIncludes): boolean {
  const status = a.status as AssignmentStatus | null | undefined;
  if (status == null) {
    return true;
  }
  const s = String(status).trim().toUpperCase();
  if (s.length === 0) {
    return true;
  }
  return s === AssignmentStatus.ACTIVE || s === AssignmentStatus.STANDBY;
}

/** Asegura `idTeacher` en cada fila para que el filtro encuentre al profesor. */
export function normalizeAssignmentsForEligibility(
  assignments: AssignmentWithIncludes[],
): AssignmentWithIncludes[] {
  return assignments.map((a) => {
    const idTeacher = resolveAssignmentTeacherId(a);
    if (idTeacher == null || a.idTeacher === idTeacher) {
      return a;
    }
    return { ...a, idTeacher };
  });
}

/** Rellena `subject.hours` desde el catálogo cuando el listado de assignments no las trae. */
export function enrichAssignmentsWithSubjectHours(
  assignments: AssignmentWithIncludes[],
  hoursBySubjectId: ReadonlyMap<number, number>,
): AssignmentWithIncludes[] {
  return assignments.map((a) => {
    const subjectId = a.subject?.id;
    if (subjectId == null) {
      return a;
    }
    const hours = a.subject?.hours ?? hoursBySubjectId.get(subjectId);
    if (hours == null || hours === a.subject?.hours) {
      return a;
    }
    return { ...a, subject: { ...a.subject!, hours } };
  });
}

/**
 * Cuenta imparticiones ACTIVE y horas en el array recibido.
 * El año escolar (u otros filtros) los aplica quien construye `assignments`.
 */
/** Opción de profesor para `<select>` (sustituciones y asignaciones de curso). */
export interface SubstituteTeacherSelectOption {
  id: number;
  label: string;
}

export function teacherOwnLoadFromAssignments(
  assignments: AssignmentWithIncludes[],
  teacherId: number,
): Pick<TeacherTeachingLoad, 'ownAssignmentCount' | 'ownWeeklyHours'> {
  const list = normalizeAssignmentsForEligibility(assignments);
  const normalizedId = Number(teacherId);
  const mine = list.filter(
    (a) =>
      resolveAssignmentTeacherId(a) === normalizedId && countsTowardTeacherLoad(a),
  );
  const ownWeeklyHours = mine.reduce((sum, a) => sum + (a.subject?.hours ?? 0), 0);
  return { ownAssignmentCount: mine.length, ownWeeklyHours };
}

/** `true` si ya es sustituto activo de algún titular (no puede coger otra sustitución). */
export function isActiveSubstituteTeacher(
  teacherId: number,
  activeSubstitutions: AssignmentSubstitution[],
): boolean {
  const id = Number(teacherId);
  return activeSubstitutions.some((s) => Number(s.idSubstitute) === id);
}

/** Titular de la impartición cubierta por una sustitución activa. */
export function titularTeacherIdFromSubstitution(
  sub: AssignmentSubstitution,
  assignments: AssignmentWithIncludes[],
): number | undefined {
  const nested = sub.teacherAssignment;
  if (nested) {
    return resolveAssignmentTeacherId(nested as AssignmentWithIncludes);
  }
  const row = assignments.find((a) => a.id === sub.idTeacherAssignment);
  return row ? resolveAssignmentTeacherId(row) : undefined;
}

/** `true` si le están sustituyendo ahora (no puede ser sustituto de otro). */
export function isTitularBeingSubstituted(
  teacherId: number,
  activeSubstitutions: AssignmentSubstitution[],
  assignments: AssignmentWithIncludes[],
): boolean {
  const id = Number(teacherId);
  return activeSubstitutions.some(
    (s) => Number(titularTeacherIdFromSubstitution(s, assignments)) === id,
  );
}

/**
 * Carga total: imparticiones propias + horas/clases que ya cubre como sustituto.
 */
export function teacherEffectiveTeachingLoad(
  assignments: AssignmentWithIncludes[],
  activeSubstitutions: AssignmentSubstitution[],
  teacherId: number,
  schoolYear: string,
): TeacherTeachingLoad {
  const own = teacherOwnLoadFromAssignments(assignments, teacherId);
  const assignmentById = new Map(assignments.map((a) => [a.id, a]));

  const covering = activeSubstitutions.filter((s) => s.idSubstitute === teacherId);
  let substituteCoverWeeklyHours = 0;
  for (const sub of covering) {
    const assignment =
      assignmentById.get(sub.idTeacherAssignment) ??
      (sub.teacherAssignment
        ? ({
            id: sub.idTeacherAssignment,
            subject: sub.teacherAssignment.subject,
          } as AssignmentWithIncludes)
        : undefined);
    substituteCoverWeeklyHours += assignment?.subject?.hours ?? 0;
  }

  const activeSubstituteSlots = covering.length;
  return {
    ...own,
    activeSubstituteSlots,
    substituteCoverWeeklyHours,
    activeAssignmentCount: own.ownAssignmentCount + activeSubstituteSlots,
    weeklyHours: own.ownWeeklyHours + substituteCoverWeeklyHours,
  };
}

/** @deprecated Usar {@link teacherOwnLoadFromAssignments}. */
export function teacherTeachingLoadFromAssignments(
  assignments: AssignmentWithIncludes[],
  teacherId: number,
  schoolYear: string,
): { activeAssignmentCount: number; weeklyHours: number } {
  const load = teacherEffectiveTeachingLoad(assignments, [], teacherId, schoolYear);
  return {
    activeAssignmentCount: load.activeAssignmentCount,
    weeklyHours: load.weeklyHours,
  };
}

/**
 * Profesor apto: no es el titular elegido, no está siendo sustituido, no sustituye a otro
 * y su carga en assignments ACTIVE no supera los umbrales.
 */
export function isEligibleSubstituteTeacher(
  teacherId: number,
  assignments: AssignmentWithIncludes[],
  activeSubstitutions: AssignmentSubstitution[],
  schoolYear: string,
  titularTeacherId: number | null,
  thresholds: SubstituteEligibilityThresholds,
): boolean {
  const id = Number(teacherId);
  if (titularTeacherId != null && id === Number(titularTeacherId)) {
    return false;
  }
  if (isActiveSubstituteTeacher(id, activeSubstitutions)) {
    return false;
  }
  if (isTitularBeingSubstituted(id, activeSubstitutions, assignments)) {
    return false;
  }
  return isTeacherEligibleByAssignmentLoad(assignments, id, thresholds);
}

/** Etiqueta del desplegable de sustituto / asignaciones (carga desde assignments del año). */
export function substituteTeacherOptionLabel(
  teacherId: number,
  name: string,
  assignments: AssignmentWithIncludes[],
): string {
  const load = teacherOwnLoadFromAssignments(assignments, teacherId);
  if (load.ownWeeklyHours === 0 && load.ownAssignmentCount === 0) {
    return `${name} (0 h)`;
  }
  return `${name} (${load.ownWeeklyHours} h, ${load.ownAssignmentCount} imp.)`;
}

/**
 * Lista de profesores para `<select>`: misma regla que `substituteTeacherOptions` en sustituciones.
 * Incluye profesores sin imparticiones (0 h) y excluye los que superan umbrales o reglas de sustitución.
 */
export function buildSubstituteTeacherSelectOptions(
  allTeachers: ReadonlyArray<{ id: number; label: string }>,
  assignments: AssignmentWithIncludes[],
  activeSubstitutions: AssignmentSubstitution[],
  schoolYear: string,
  titularTeacherId: number | null,
  thresholds: SubstituteEligibilityThresholds,
): SubstituteTeacherSelectOption[] {
  const normalized = normalizeAssignmentsForEligibility(assignments);
  return allTeachers
    .filter((t) =>
      isEligibleSubstituteTeacher(
        t.id,
        normalized,
        activeSubstitutions,
        schoolYear,
        titularTeacherId,
        thresholds,
      ),
    )
    .map((t) => ({
      id: t.id,
      label: substituteTeacherOptionLabel(t.id, t.label, normalized),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Misma regla de carga que el selector de sustituto (sin reglas de sustitución).
 * `weeklyHours` y `activeAssignments` deben ser ≤ umbrales de `environment.substituteEligibility`.
 */
export function isTeacherEligibleByAssignmentLoad(
  assignments: AssignmentWithIncludes[],
  teacherId: number,
  thresholds: SubstituteEligibilityThresholds,
): boolean {
  const load = teacherOwnLoadFromAssignments(assignments, teacherId);
  return (
    load.ownAssignmentCount <= thresholds.maxActiveAssignments &&
    load.ownWeeklyHours <= thresholds.maxWeeklyHours
  );
}

/** Normaliza `GET /api/assignments` (array suelto o `{ success, data }`). */
export function parseAssignmentsApiResponse(body: unknown): AssignmentsWithIncludesResponse {
  if (body == null) {
    return { success: false, data: [], count: 0 };
  }

  if (Array.isArray(body)) {
    const data = normalizeAssignmentsForEligibility(body as AssignmentWithIncludes[]);
    return { success: true, data, count: data.length };
  }

  if (typeof body !== 'object') {
    return { success: false, data: [], count: 0 };
  }

  const record = body as Record<string, unknown>;
  const rawData = record['data'];
  const success = record['success'] !== false;

  if (!Array.isArray(rawData)) {
    return { success: false, data: [], count: 0 };
  }

  const data = normalizeAssignmentsForEligibility(rawData as AssignmentWithIncludes[]);
  const count =
    typeof record['count'] === 'number' ? (record['count'] as number) : data.length;

  return { success, data, count };
}
