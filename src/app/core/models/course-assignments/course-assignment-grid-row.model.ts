/**
 * Fila editable del datagrid de asignaciones (CURSO-98).
 */
export interface CourseAssignmentGridRow {
  idSubject: number;
  subjectName: string;
  idTeacher: number | null;
  idGroup: number | null;
}
