import { Subject } from "./subject";

/**
 * Representa un ciclo académico del sistema.
 * Un ciclo agrupa las asignaturas que se imparten a lo largo de su duración,
 * que habitualmente es de dos cursos académicos.
 * @example
 * const course: Course = {
 *   id: ID_CICLO,
 *   name: 'NOMBRE_CICLO',
 *   description: 'DESCRIPCION_CICLO',
 *   duration: DURACION_EN_AÑOS,
 *   createdAt: 'FECHA_CREACION',
 *   subjects: [
 *     {
 *       id: ID_ASIGNATURA,
 *       name: 'NOMBRE_ASIGNATURA',
 *       grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *       hours: HORAS_SEMANALES,
 *       description: 'DESCRIPCION_ASIGNATURA',
 *       idCourse: ID_CICLO
 *     }
 *   ]
 * };
 */
export interface Course {
  id: number;
  name: string;
  description: string;
  duration: number;
  createdAt: string;
  subjects: {
    id: number;
    name: string;
    grade: string;
    hours: number;
    description: string;
    idCourse: number;
  }[];
}


/**
 * Respuesta de la API al consultar un ciclo por su identificador.
 * @example
 * const response: CourseByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_CICLO,
 *     name: 'NOMBRE_CICLO',
 *     description: 'DESCRIPCION_CICLO',
 *     duration: DURACION_EN_AÑOS,
 *     createdAt: 'FECHA_CREACION',
 *     subjects: [
 *       {
 *         id: ID_ASIGNATURA,
 *         name: 'NOMBRE_ASIGNATURA',
 *         grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *         hours: HORAS_SEMANALES,
 *         description: 'DESCRIPCION_ASIGNATURA',
 *         idCourse: ID_CICLO
 *       }
 *     ]
 *   }
 * };
 */
export interface CourseByIdResponse {
  success: boolean;
  data: Course;
}

/**
 * Respuesta de la API al consultar todos los ciclos.
 * @example
 * const response: CoursesAllResponse = {
 *   success: true,
 *   count: TOTAL_CICLOS,
 *   data: [
 *     {
 *       id: ID_CICLO,
 *       name: 'NOMBRE_CICLO',
 *       description: 'DESCRIPCION_CICLO',
 *       duration: DURACION_EN_AÑOS,
 *       createdAt: 'FECHA_CREACION',
 *       subjects: [
 *         {
 *           id: ID_ASIGNATURA,
 *           name: 'NOMBRE_ASIGNATURA',
 *           grade: 'CURSO_EN_QUE_SE_IMPARTE',
 *           hours: HORAS_SEMANALES,
 *           description: 'DESCRIPCION_ASIGNATURA',
 *           idCourse: ID_CICLO
 *         }
 *       ]
 *     }
 *   ]
 * };
 */
export interface CoursesAllResponse {
  success: boolean;
  data: Course[];
  count: number;
}

/**
 * Datos necesarios para crear un nuevo ciclo.
 * @example
 * const request: CourseCreateRequest = {
 *   name: 'NOMBRE_CICLO',
 *   duration: 2
 * };
 */
export interface CourseCreateRequest{
  name: string;
  duration: number
}

/**
 * Respuesta de la API tras crear un nuevo ciclo.
 * @example
 * const response: CourseCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_CICLO,
 *     name: 'NOMBRE_CICLO'
 *     duration: 2
 *   }
 * };
 */
export interface CourseCreateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    duration: 2
  };
}


/**
 * Datos necesarios para actualizar un ciclo existente.
 * @example
 * const request: CourseUpdateRequest = {
 *   id: ID_CICLO,
 *   name: 'NOMBRE_CICLO',
 *   description: 'DESCRIPCION_CICLO',
 *   duration: DURACION_EN_AÑOS
 * };
 */
export interface CourseUpdateRequest {
  id: number;
  name: string;
  description: string;
  duration: number;
}

/**
 * Respuesta de la API tras actualizar un ciclo.
 * @example
 * const response: CourseUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_CICLO,
 *     name: 'NOMBRE_CICLO',
 *     description: 'DESCRIPCION_CICLO',
 *     duration: DURACION_EN_AÑOS
 *   }
 * };
 */
export interface CourseUpdateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    description: string;
    duration: number;
  };
}

/**
 * Respuesta de la API tras eliminar un ciclo.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de courses.
 * @example
 * const response: CourseDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_COURSE',
 *   deletedId: ID_CICLO
 * };
 */
export interface CourseDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}


