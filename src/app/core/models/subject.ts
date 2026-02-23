
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
  id: number;
  name: string;
  grade: string;
  hours: number;
  description: string;
  idCourse: number;
  course: {
    id: number;
    name: string;
    description: string;
    duration: number;
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
  success: boolean;
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
  success: boolean;
  data: Subject[];
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
  name: string;
  grade: string;
  hours: number;
  description: string;
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
  success: boolean;
  message: string;
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
  name: string;
  grade: string;
  hours: number;
  description: string;
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
  success: boolean;
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
  success: boolean;
  message: string;
  deletedId: number;
}