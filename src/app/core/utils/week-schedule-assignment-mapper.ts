import type { AssignmentWithIncludes } from '../models/assingment';
import type { TeacherSubjectAssignmentRow } from '../models/teacher/subjectforteacher';

/** Convierte fila de `GET /api/assignments` al shape usado por la rejilla de horarios. */
export function assignmentWithIncludesToTeacherRow(
  a: AssignmentWithIncludes,
): TeacherSubjectAssignmentRow {
  const sub = a.subject;
  const idCourse = sub?.course?.id ?? (sub as { idCourse?: number } | undefined)?.idCourse;
  return {
    id: a.id,
    idTeacher: a.idTeacher,
    idSubject: a.idSubject,
    idGroup: a.idGroup,
    schoolYear: a.schoolYear,
    status: a.status,
    subject: {
      id: sub?.id ?? a.idSubject,
      name: sub?.name?.trim() ?? '',
      grade: sub?.grade,
      hours: sub?.hours,
      course:
        sub?.course ??
        (idCourse != null ? { id: idCourse, name: sub?.course?.name ?? '' } : undefined),
    },
    group: a.group ?? undefined,
  };
}
