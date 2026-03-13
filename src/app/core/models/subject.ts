// models/subject.model.ts

/**
 * Representa una asignatura del sistema.
 * @example
 * const subject: Subject = {
 *   id: ID_ASIGNATURA,
 *   name: 'NOMBRE_ASIGNATURA',
 *   grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *   hours: HORAS_SEMANALES,
 *   description: 'DESCRIPCION_ASIGNATURA',
 *   idCourse: ID_CICLO,
 *   course: {
 *     id: ID_CICLO,
 *     name: 'NOMBRE_CICLO',
 *     description: 'DESCRIPCION_CICLO',
 *     duration: DURACION_CICLO_EN_AÑOS,
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface Subject {
  /** Identificador único de la asignatura */
  id: number;
  /** Nombre de la asignatura */
  name: string;
  /** Curso en el que se imparte la asignatura */
  grade: string;
  /** Horas semanales de la asignatura */
  hours: number;
  /** Descripción de la asignatura */
  description: string;
  /** Identificador del ciclo al que pertenece la asignatura */
  idCourse: number;
  /** Datos del ciclo al que pertenece la asignatura */
  course: {
    /** Identificador único del ciclo */
    id: number;
    /** Nombre del ciclo */
    name: string;
    /** Descripción del ciclo */
    description: string;
    /** Duración del ciclo en años */
    duration: number;
    /** Fecha de creación del registro del ciclo */
    createdAt: string;
  };
}

/**
 * Respuesta de la API al consultar una asignatura por su identificador.
 * @example
 * const response: SubjectByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASIGNATURA,
 *     name: 'NOMBRE_ASIGNATURA',
 *     grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *     hours: HORAS_SEMANALES,
 *     description: 'DESCRIPCION_ASIGNATURA',
 *     idCourse: ID_CICLO,
 *     course: {
 *       id: ID_CICLO,
 *       name: 'NOMBRE_CICLO',
 *       description: 'DESCRIPCION_CICLO',
 *       duration: DURACION_CICLO_EN_AÑOS,
 *       createdAt: 'FECHA_CREACION'
 *     }
 *   }
 * };
 */
export interface SubjectByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la asignatura encontrada */
  data: Subject;
}

/**
 * Respuesta de la API al consultar todas las asignaturas.
 * @example
 * const response: SubjectsAllResponse = {
 *   success: true,
 *   count: TOTAL_ASIGNATURAS,
 *   data: [
 *     {
 *       id: ID_ASIGNATURA,
 *       name: 'NOMBRE_ASIGNATURA',
 *       grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *       hours: HORAS_SEMANALES,
 *       description: 'DESCRIPCION_ASIGNATURA',
 *       idCourse: ID_CICLO,
 *       course: {
 *         id: ID_CICLO,
 *         name: 'NOMBRE_CICLO',
 *         description: 'DESCRIPCION_CICLO',
 *         duration: DURACION_CICLO_EN_AÑOS,
 *         createdAt: 'FECHA_CREACION'
 *       }
 *     }
 *   ]
 * };
 */
export interface SubjectsAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de asignaturas */
  data: Subject[];
  /** Número total de asignaturas devueltas */
  count: number;
}

/**
 * Datos necesarios para crear una nueva asignatura.
 * @example
 * const request: SubjectCreateRequest = {
 *   name: 'NOMBRE_ASIGNATURA',
 *   grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *   hours: HORAS_SEMANALES,
 *   description: 'DESCRIPCION_ASIGNATURA',
 *   idCourse: ID_CICLO
 * };
 */
export interface SubjectCreateRequest {
  /** Nombre de la asignatura */
  name: string;
  /** Curso en el que se imparte la asignatura */
  grade: string;
  /** Horas semanales de la asignatura */
  hours: number;
  /** Descripción de la asignatura */
  description: string;
  /** Identificador del ciclo al que pertenece la asignatura */
  idCourse: number;
}

/**
 * Respuesta de la API tras crear una nueva asignatura.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta POST de subjects.
 * @example
 * const response: SubjectCreateResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_POST_SUBJECT',
 *   data: {
 *     id: ID_ASIGNATURA,
 *     name: 'NOMBRE_ASIGNATURA',
 *     grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *     hours: HORAS_SEMANALES,
 *     description: 'DESCRIPCION_ASIGNATURA',
 *     idCourse: ID_CICLO,
 *     course: {
 *       id: ID_CICLO,
 *       name: 'NOMBRE_CICLO',
 *       description: 'DESCRIPCION_CICLO',
 *       duration: DURACION_CICLO_EN_AÑOS,
 *       createdAt: 'FECHA_CREACION'
 *     }
 *   }
 * };
 */
export interface SubjectCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Datos de la asignatura creada */
  data: Subject;
}

/**
 * Datos necesarios para actualizar una asignatura existente.
 * @example
 * const request: SubjectUpdateRequest = {
 *   name: 'NOMBRE_ASIGNATURA',
 *   grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *   hours: HORAS_SEMANALES,
 *   description: 'DESCRIPCION_ASIGNATURA',
 *   idCourse: ID_CICLO
 * };
 */
export interface SubjectUpdateRequest {
  /** Nuevo nombre de la asignatura */
  name: string;
  /** Nuevo curso en el que se imparte la asignatura */
  grade: string;
  /** Nuevas horas semanales de la asignatura */
  hours: number;
  /** Nueva descripción de la asignatura */
  description: string;
  /** Nuevo identificador del ciclo al que pertenece la asignatura */
  idCourse: number;
}

/**
 * Respuesta de la API tras actualizar una asignatura.
 * @example
 * const response: SubjectUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASIGNATURA,
 *     name: 'NOMBRE_ASIGNATURA',
 *     grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *     hours: HORAS_SEMANALES,
 *     description: 'DESCRIPCION_ASIGNATURA',
 *     idCourse: ID_CICLO,
 *     course: {
 *       id: ID_CICLO,
 *       name: 'NOMBRE_CICLO',
 *       description: 'DESCRIPCION_CICLO',
 *       duration: DURACION_CICLO_EN_AÑOS,
 *       createdAt: 'FECHA_CREACION'
 *     }
 *   }
 * };
 */
export interface SubjectUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la asignatura actualizada */
  data: Subject;
}

/**
 * Respuesta de la API tras eliminar una asignatura.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de subjects.
 * @example
 * const response: SubjectDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_SUBJECT',
 *   deletedId: ID_ASIGNATURA
 * };
 */
export interface SubjectDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la asignatura eliminada */
  deletedId: number;
}