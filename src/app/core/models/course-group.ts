/** Relación entre un ciclo formativo, un grupo y su tutor opcional. */
export interface CourseGroup {
  /** Identificador de la fila en `course_groups`. */
  id: number;

  /** Ciclo al que pertenece el grupo. */
  idCourse: number;

  /** Datos resumidos del ciclo. */
  course: { id: number; name: string };

  /** Grupo académico asociado. */
  idGroup: number;

  /** Datos resumidos del grupo. */
  group: { id: number; name: string };

  /** Curso dentro del ciclo (`"1"` o `"2"`). */
  grade: string;

  /** Profesor tutor asignado, o `null` si no hay tutor. */
  tutorId: number | null;

  /** Datos del tutor cuando `tutorId` no es nulo. */
  tutor: { id: number; name: string; surname: string } | null;
}

/** Respuesta de listado de grupos por ciclo. */
export interface CourseGroupsResponse {
  /** Indica éxito de la operación HTTP. */
  success: boolean;

  /** Grupos del ciclo solicitado. */
  data: CourseGroup[];

  /** Total de registros devueltos. */
  count: number;
}

/** Respuesta al asignar o cambiar el tutor de un grupo en un ciclo. */
export interface AssignTutorResponse {
  /** Indica éxito de la operación HTTP. */
  success: boolean;

  /** Mensaje descriptivo del backend. */
  message: string;

  /** Grupo actualizado con el tutor asignado. */
  data: CourseGroup;
}
