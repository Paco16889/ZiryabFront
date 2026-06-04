import type { AssignmentWithIncludes } from '../models/assingment';

/**
 * Localiza el profesor tutor de las asignaciones que coinciden con la matrícula
 * (mismo grupo, año escolar y alguna de las asignaturas matriculadas).
 */
export function resolveTutorIdForEnrollment(
  assignments: AssignmentWithIncludes[],
  idGroup: number,
  idSubjectIds: number[],
  schoolYear: string,
): number | null {
  const subjectIds = new Set(idSubjectIds);
  const tutorTeacherIds = new Set<number>();

  for (const row of assignments) {
    const groupId = row.idGroup ?? row.group?.id;
    const subjectId = row.idSubject ?? row.subject?.id;
    const teacherId = row.idTeacher ?? row.teacher?.id;

    if (
      groupId !== idGroup ||
      row.schoolYear !== schoolYear ||
      subjectId == null ||
      !subjectIds.has(subjectId) ||
      !row.isTutor ||
      teacherId == null
    ) {
      continue;
    }
    tutorTeacherIds.add(teacherId);
  }

  if (tutorTeacherIds.size === 0) {
    return null;
  }

  return [...tutorTeacherIds].sort((a, b) => a - b)[0];
}
