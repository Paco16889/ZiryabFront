// models/group.model.ts

/**
 * Representa un grupo del sistema.
 * Un grupo identifica una división dentro de un ciclo académico,
 * su nombre puede ser Mañana, Tarde, A, B, C, etc. y la capacidad de alumnos del grupo.
 * @example
 * const group: Group = {
 *   id: ID_GRUPO,
 *   name: 'NOMBRE_GRUPO',
 *   capacity: CAPACIDAD_MAXIMA
 * };
 */
export interface Group {
  /** Identificador único del grupo */
  id: number;
  /** Nombre del grupo, por ejemplo 'Mañana', 'Tarde', 'A', 'B' */
  name: string;
  /** Capacidad máxima de alumnos del grupo */
  capacity: number;
}

/**
 * Respuesta de la API al consultar todos los grupos.
 * @example
 * const response: GroupsAllResponse = {
 *   success: true,
 *   count: TOTAL_GRUPOS,
 *   data: [
 *     {
 *       id: ID_GRUPO,
 *       name: 'NOMBRE_GRUPO',
 *       capacity: CAPACIDAD_MAXIMA
 *     }
 *   ]
 * };
 */
export interface GroupsAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de grupos */
  data: Group[];
  /** Número total de grupos devueltos */
  count: number;
}

/**
 * Respuesta de la API al consultar un grupo por su identificador.
 * @example
 * const response: GroupByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_GRUPO,
 *     name: 'NOMBRE_GRUPO',
 *     capacity: CAPACIDAD_MAXIMA
 *   }
 * };
 */
export interface GroupByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del grupo encontrado */
  data: Group;
}

/**
 * Datos necesarios para crear un nuevo grupo.
 * @example
 * const request: GroupCreateRequest = {
 *   name: 'NOMBRE_GRUPO',
 *   capacity: CAPACIDAD_MAXIMA
 * };
 */
export interface GroupCreateRequest {
  /** Nombre del grupo */
  name: string;
  /** Capacidad máxima de alumnos del grupo */
  capacity: number;
}

/**
 * Respuesta de la API tras crear un nuevo grupo.
 * @example
 * const response: GroupCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_GRUPO,
 *     name: 'NOMBRE_GRUPO',
 *     capacity: CAPACIDAD_MAXIMA
 *   }
 * };
 */
export interface GroupCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del grupo creado */
  data: Group;
}

/**
 * Datos necesarios para actualizar un grupo existente.
 * @example
 * const request: GroupUpdateRequest = {
 *   id: ID_GRUPO,
 *   name: 'NOMBRE_GRUPO',
 *   capacity: CAPACIDAD_MAXIMA
 * };
 */
export interface GroupUpdateRequest {
  /** Identificador único del grupo a actualizar */
  id: number;
  /** Nuevo nombre del grupo */
  name: string;
  /** Nueva capacidad máxima de alumnos del grupo */
  capacity: number;
}

/**
 * Respuesta de la API tras actualizar un grupo.
 * @example
 * const response: GroupUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_GRUPO,
 *     name: 'NOMBRE_GRUPO',
 *     capacity: CAPACIDAD_MAXIMA
 *   }
 * };
 */
export interface GroupUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del grupo actualizado */
  data: {
    /** Identificador único del grupo actualizado */
    id: number;
    /** Nombre del grupo actualizado */
    name: string;
    /** Capacidad máxima de alumnos del grupo actualizado */
    capacity: number;
  };
}

/**
 * Respuesta de la API tras eliminar un grupo.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de groups.
 * @example
 * const response: GroupDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_GROUP',
 *   deletedId: ID_GRUPO
 * };
 */
export interface GroupDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador del grupo eliminado */
  deletedId: number;
}