import { AssignmentStatus, AssignmentWithIncludes } from '../models/assingment';

type AssignmentTeacherIdSource = AssignmentWithIncludes & {
  teacherId?: number;
  id_teacher?: number;
};

type SubjectHoursSource = NonNullable<AssignmentWithIncludes['subject']> & {
  weeklyHours?: number;
  horas?: number;
};

/** Id del profesor en una impartición (varios nombres que devuelve el API). */
export function resolveAssignmentTeacherId(a: AssignmentWithIncludes): number | undefined {
  const raw = a as AssignmentTeacherIdSource;
  const id = raw.idTeacher ?? raw.teacherId ?? raw.id_teacher ?? raw.teacher?.id;
  return id != null && !Number.isNaN(Number(id)) ? Number(id) : undefined;
}

/** Horas semanales de la asignatura en la fila del API. */
export function resolveSubjectWeeklyHours(
  subject: AssignmentWithIncludes['subject'],
): number {
  if (subject == null) {
    return 0;
  }
  const raw = subject as SubjectHoursSource;
  const value = raw.hours ?? raw.weeklyHours ?? raw.horas;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Imparticiones que cuentan para carga: `ACTIVE`, `STANDBY` o sin estado
 * (mismo criterio que el builder de horarios).
 */
export function countsTowardTeacherLoad(a: AssignmentWithIncludes): boolean {
  const status = a.status;
  if (status == null || String(status) === '') {
    return true;
  }
  const s = String(status).toUpperCase();
  return s === AssignmentStatus.ACTIVE || s === AssignmentStatus.STANDBY;
}

/** Asegura `idTeacher` y `subject.hours` para el filtro de elegibilidad. */
export function normalizeAssignmentsForEligibility(
  assignments: AssignmentWithIncludes[],
): AssignmentWithIncludes[] {
  return assignments.map((a) => {
    const idTeacher = resolveAssignmentTeacherId(a);
    const hours = resolveSubjectWeeklyHours(a.subject);
    const subject =
      a.subject == null
        ? a.subject
        : hours === (a.subject.hours ?? 0) && a.subject.hours != null
          ? a.subject
          : { ...a.subject, hours };
    if (idTeacher == null) {
      return subject === a.subject ? a : { ...a, subject };
    }
    if (a.idTeacher === idTeacher && subject === a.subject) {
      return a;
    }
    return { ...a, idTeacher, subject };
  });
}
