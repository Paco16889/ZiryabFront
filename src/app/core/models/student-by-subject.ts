/** Alumno matriculado en una asignatura concreta, usado por vistas de profesor. */
export interface StudentBySubject {
  /** Identificador de la matrícula que vincula alumno, asignatura y grupo. */
  enrollmentId: number;

  /** Identificador del alumno. */
  studentId: number;

  /** Nombre del alumno. */
  name: string;

  /** Primer apellido del alumno. */
  surname: string;

  /** Identificador del grupo al que pertenece la matrícula. */
  groupId: number;

  /** Nombre visible del grupo. */
  groupName: string;
}

/** Respuesta del backend al listar alumnos por asignatura. */
export interface StudentsBySubjectResponse {
  /** Indica si la consulta se resolvió correctamente. */
  success: boolean;

  /** Alumnos matriculados en la asignatura solicitada. */
  data: StudentBySubject[];

  /** Mensaje opcional devuelto por el backend. */
  message?: string;
}
