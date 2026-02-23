// models/group.model.ts

/**
 * Representa un grupo del sistema.
 * Un grupo identifica una división dentro de un ciclo académico,
 * su nombre puede ser  Mañana, Tarde, A, B, C, etc. y la capacidad de alumnos del grupo
 * @example
 * const group: Group = {
 *   id: ID_GRUPO,
 *   name: 'NOMBRE_GRUPO',
 *   capacity: CAPACIDAD_MAXIMA
 * };
 */
export interface Group {
  id: number;
  name: string;
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
  success: boolean;
  data: Group[];
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
  success: boolean;
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
  name: string;
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
  success: boolean;
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
  id: number;
  name: string;
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
  success: boolean;
  data: {
    id: number;
    name: string;
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
  success: boolean;
  message: string;
  deletedId: number;
}