import { Assistance } from "./assistance";
import { WeekSchedule } from "./week-schedule";

/**
 * Representa una sesión de clase celebrada en una franja horaria concreta.
 * @example
 * const classSession: ClassSession = {
 *   id: ID_SESION,
 *   date: 'FECHA_SESION',
 *   status: 'ESTADO_SESION',
 *   appointments: 'ANOTACIONES_SESION',
 *   createdAt: 'FECHA_CREACION',
 *   schedule: OBJETO_WEEKSCHEDULE,
 *   assistances: [OBJETO_ASSISTANCE]
 * };
 */
export interface ClassSession {
  /** Identificador único de la sesión de clase */
  id: number;
  /** Fecha en la que se celebra la sesión */
  date: string;
  /** Estado actual de la sesión */
  status: string;
  /** Anotaciones o comentarios sobre la sesión, null si no hay ninguno */
  appointments: string | null;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Franja horaria semanal a la que pertenece la sesión */
  schedule: WeekSchedule;
  /** Registros de asistencia de los estudiantes a esta sesión */
  assistances: Assistance[];
}

/**
 * Respuesta de la API al consultar todas las sesiones de clase.
 * @example
 * const response: ClassSessionsAllResponse = {
 *   success: true,
 *   count: TOTAL_SESIONES,
 *   data: [
 *     {
 *       id: ID_SESION,
 *       date: 'FECHA_SESION',
 *       status: 'ESTADO_SESION',
 *       appointments: 'ANOTACIONES_SESION',
 *       createdAt: 'FECHA_CREACION',
 *       schedule: OBJETO_WEEKSCHEDULE,
 *       assistances: [OBJETO_ASSISTANCE]
 *     }
 *   ]
 * };
 */
export interface ClassSessionsAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de sesiones de clase */
  data: ClassSession[];
  /** Número total de sesiones de clase devueltas */
  count: number;
}

/**
 * Respuesta de la API al consultar una sesión de clase por su identificador.
 * @example
 * const response: ClassSessionByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_SESION,
 *     date: 'FECHA_SESION',
 *     status: 'ESTADO_SESION',
 *     appointments: 'ANOTACIONES_SESION',
 *     createdAt: 'FECHA_CREACION',
 *     schedule: OBJETO_WEEKSCHEDULE,
 *     assistances: [OBJETO_ASSISTANCE]
 *   }
 * };
 */
export interface ClassSessionByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la sesión de clase encontrada */
  data: ClassSession;
}

/**
 * Datos necesarios para crear una nueva sesión de clase.
 * @example
 * const request: ClassSessionCreateRequest = {
 *   idSchedule: ID_HORARIO,
 *   date: 'FECHA_SESION',
 *   status: 'ESTADO_SESION',
 *   appointments: 'ANOTACIONES_SESION'
 * };
 */
export interface ClassSessionCreateRequest {
  /** Identificador de la franja horaria semanal a la que pertenece la sesión */
  idSchedule: number;
  /** Fecha en la que se celebra la sesión */
  date: string;
  /** Estado inicial de la sesión, opcional */
  status?: string;
  /** Anotaciones o comentarios sobre la sesión, opcional */
  appointments?: string;
}

/**
 * Respuesta de la API tras crear una nueva sesión de clase.
 * @example
 * const response: ClassSessionCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_SESION,
 *     date: 'FECHA_SESION',
 *     status: 'ESTADO_SESION',
 *     appointments: 'ANOTACIONES_SESION',
 *     createdAt: 'FECHA_CREACION',
 *     schedule: OBJETO_WEEKSCHEDULE,
 *     assistances: [OBJETO_ASSISTANCE]
 *   }
 * };
 */
export interface ClassSessionCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la sesión de clase creada */
  data: ClassSession;
}

/**
 * Datos necesarios para actualizar una sesión de clase existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: ClassSessionUpdateRequest = {
 *   date: 'FECHA_SESION',
 *   status: 'ESTADO_SESION',
 *   appointments: 'ANOTACIONES_SESION'
 * };
 */
export interface ClassSessionUpdateRequest {
  /** Nueva fecha de la sesión */
  date?: string;
  /** Nuevo estado de la sesión */
  status?: string;
  /** Nuevas anotaciones o comentarios sobre la sesión */
  appointments?: string;
}

/**
 * Respuesta de la API tras actualizar una sesión de clase.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta PUT de class-sessions.
 * @example
 * const response: ClassSessionUpdateResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_UPDATE_CLASSSESSION',
 *   data: {
 *     id: ID_SESION,
 *     date: 'FECHA_SESION',
 *     status: 'ESTADO_SESION',
 *     appointments: 'ANOTACIONES_SESION',
 *     createdAt: 'FECHA_CREACION',
 *     schedule: OBJETO_WEEKSCHEDULE,
 *     assistances: [OBJETO_ASSISTANCE]
 *   }
 * };
 */
export interface ClassSessionUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Datos de la sesión de clase actualizada */
  data: ClassSession;
}

/**
 * Respuesta de la API tras eliminar una sesión de clase.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de class-sessions.
 * @example
 * const response: ClassSessionDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_CLASSSESSION',
 *   deletedId: ID_SESION
 * };
 */
export interface ClassSessionDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la sesión de clase eliminada */
  deletedId: number;
}