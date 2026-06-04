/** Fragmentos de asignatura usados en subtítulos de tarjetas de clase. */
export interface ClassCardSubjectRef {
  grade?: string;
  course?: { name?: string } | null;
}

/**
 * Subtítulo superior del alumno: grado de la asignatura y ciclo (`course.name`).
 * Misma convención que el label del horario: `{grade} {course.name}`.
 */
export function formatStudentClassLevelSubtitle(
  subject?: ClassCardSubjectRef | null,
): string {
  if (!subject) {
    return '-';
  }
  const grade = subject.grade?.trim();
  const courseName = subject.course?.name?.trim();
  if (grade && courseName) {
    return `${grade} — ${courseName}`;
  }
  return courseName || grade || '-';
}

/** Ciclo formativo de la asignatura (nombre del curso/ciclo). */
export function formatTeacherClassCourseSubtitle(
  subject?: ClassCardSubjectRef | null,
): string {
  const courseName = subject?.course?.name?.trim();
  return courseName || '-';
}

/** Grado académico y grupo en la tarjeta del profesor. */
export function formatTeacherClassGroupSubtitle(
  subject?: ClassCardSubjectRef | null,
  group?: { name?: string } | null,
): string {
  const groupName = group?.name?.trim();
  const grade = subject?.grade?.trim();
  if (grade && groupName) {
    return `${grade} — ${groupName}`;
  }
  return groupName || grade || 'Varios';
}
