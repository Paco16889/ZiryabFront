/**
 * Contexto de una sesión de alta de asignaciones docentes (ciclo + grade).
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-93
 */
export interface CourseAssignmentsContext {
  /** Ciclo seleccionado en el primer paso del asistente. */
  idCourse: number;

  /** Nombre del ciclo usado en cabeceras y mensajes del grid. */
  courseName: string;

  /** Valor de `Subject.grade` (p. ej. `"1"`, `"2"`). */
  grade: string;
}
