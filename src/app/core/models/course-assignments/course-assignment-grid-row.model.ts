/**
 * Fila editable del datagrid de asignaciones (CURSO-98).
 */
export interface CourseAssignmentGridRow {
  /** Asignatura que debe recibir profesor y grupo en el grid. */
  idSubject: number;

  /** Nombre visible de la asignatura. */
  subjectName: string;

  /** Profesor seleccionado; `null` mientras la fila está incompleta. */
  idTeacher: number | null;

  /** Grupo seleccionado; `null` mientras la fila está incompleta. */
  idGroup: number | null;

  /** Marca si esta asignación debe guardarse como tutoría de la clase. */
  isTutor: boolean;
}
