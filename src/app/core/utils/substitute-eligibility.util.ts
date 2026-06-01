import { AssignmentSubstitution } from '../models/assignment-substitution';
import { AssignmentStatus, AssignmentWithIncludes } from '../models/assingment';

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

/**
 * Cuenta imparticiones ACTIVE y horas semanales declaradas en asignatura.
 */
export function teacherOwnLoadFromAssignments(
  assignments: AssignmentWithIncludes[],
  teacherId: number,
  schoolYear: string,
): Pick<TeacherTeachingLoad, 'ownAssignmentCount' | 'ownWeeklyHours'> {
  const mine = assignments.filter(
    (a) =>
      a.idTeacher === teacherId &&
      a.schoolYear === schoolYear &&
      a.status === AssignmentStatus.ACTIVE,
  );
  const ownWeeklyHours = mine.reduce((sum, a) => sum + (a.subject?.hours ?? 0), 0);
  return { ownAssignmentCount: mine.length, ownWeeklyHours };
}

/** `true` si ya es sustituto activo de algún titular (no puede coger otra sustitución). */
export function isActiveSubstituteTeacher(
  teacherId: number,
  activeSubstitutions: AssignmentSubstitution[],
): boolean {
  return activeSubstitutions.some((s) => s.idSubstitute === teacherId);
}

/** Titular de la impartición cubierta por una sustitución activa. */
export function titularTeacherIdFromSubstitution(
  sub: AssignmentSubstitution,
  assignments: AssignmentWithIncludes[],
): number | undefined {
  return (
    sub.teacherAssignment?.teacher?.id ??
    sub.teacherAssignment?.idTeacher ??
    assignments.find((a) => a.id === sub.idTeacherAssignment)?.idTeacher
  );
}

/** `true` si le están sustituyendo ahora (no puede ser sustituto de otro). */
export function isTitularBeingSubstituted(
  teacherId: number,
  activeSubstitutions: AssignmentSubstitution[],
  assignments: AssignmentWithIncludes[],
): boolean {
  return activeSubstitutions.some(
    (s) => titularTeacherIdFromSubstitution(s, assignments) === teacherId,
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
  const own = teacherOwnLoadFromAssignments(assignments, teacherId, schoolYear);
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
  if (titularTeacherId != null && teacherId === titularTeacherId) {
    return false;
  }
  if (isActiveSubstituteTeacher(teacherId, activeSubstitutions)) {
    return false;
  }
  if (isTitularBeingSubstituted(teacherId, activeSubstitutions, assignments)) {
    return false;
  }
  const load = teacherOwnLoadFromAssignments(assignments, teacherId, schoolYear);
  return (
    load.ownAssignmentCount <= thresholds.maxActiveAssignments &&
    load.ownWeeklyHours <= thresholds.maxWeeklyHours
  );
}
