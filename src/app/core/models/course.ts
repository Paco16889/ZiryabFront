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
  /** Identificador único del ciclo */
  id: number;
  /** Nombre del ciclo */
  name: string;
  /** Descripción del ciclo */
  description: string;
  /** Duración del ciclo en años */
  duration: number;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Asignaturas que pertenecen al ciclo */
  subjects: {
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del ciclo encontrado */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de ciclos */
  data: Course[];
  /** Número total de ciclos devueltos */
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
export interface CourseCreateRequest {
  /** Nombre del ciclo */
  name: string;
  /** Duración del ciclo en años */
  duration: number;
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del ciclo creado */
  data: {
    /** Identificador único del ciclo creado */
    id: number;
    /** Nombre del ciclo creado */
    name: string;
    /** Duración del ciclo en años */
    duration: 2;
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
  /** Identificador único del ciclo a actualizar */
  id: number;
  /** Nuevo nombre del ciclo */
  name: string;
  /** Nueva descripción del ciclo */
  description: string;
  /** Nueva duración del ciclo en años */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del ciclo actualizado */
  data: {
    /** Identificador único del ciclo actualizado */
    id: number;
    /** Nombre del ciclo actualizado */
    name: string;
    /** Descripción del ciclo actualizado */
    description: string;
    /** Duración del ciclo en años */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador del ciclo eliminado */
  deletedId: number;
}