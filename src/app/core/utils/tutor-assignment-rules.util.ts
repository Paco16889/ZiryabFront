import type { AssignmentWithIncludes } from '../models/assingment';

/** Fila pendiente de alta con posible marca de tutor. */
export interface PendingTutorRowSlice {
  idTeacher: number | null;
  idGroup: number | null;
  isTutor: boolean;
}

/** Id del profesor en una asignación con includes. */
export function teacherIdFromAssignment(a: AssignmentWithIncludes): number | null {
  return a.idTeacher ?? a.teacher?.id ?? null;
}

/** Id del grupo en una asignación con includes. */
export function groupIdFromAssignment(a: AssignmentWithIncludes): number | null {
  if (a.group?.id != null) {
    return a.group.id;
  }
  return (a as { idGroup?: number }).idGroup ?? null;
}

/**
 * Un profesor solo puede ser tutor de un grupo (clase) en el año.
 * Devuelve false si ya es tutor en otro grupo distinto de `targetGroupId`.
 */
export function canTeacherBeTutorForGroup(
  teacherId: number,
  targetGroupId: number,
  existingAssignments: AssignmentWithIncludes[],
  pendingRows: PendingTutorRowSlice[] = [],
): boolean {
  for (const a of existingAssignments) {
    if (!a.isTutor) {
      continue;
    }
    const tid = teacherIdFromAssignment(a);
    const gid = groupIdFromAssignment(a);
    if (tid === teacherId && gid != null && gid !== targetGroupId) {
      return false;
    }
  }
  for (const row of pendingRows) {
    if (!row.isTutor || row.idTeacher !== teacherId || row.idGroup == null) {
      continue;
    }
    if (row.idGroup !== targetGroupId) {
      return false;
    }
  }
  return true;
}
