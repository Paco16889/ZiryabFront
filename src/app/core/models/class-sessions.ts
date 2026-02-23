// models/class-session.model.ts

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
  id: number;
  date: string;
  status: string;
  appointments: string | null;
  createdAt: string;
  schedule: WeekSchedule;
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
  success: boolean;
  data: ClassSession[];
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
  success: boolean;
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
  idSchedule: number;
  date: string;
  status?: string;
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
  success: boolean;
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
  date?: string;
  status?: string;
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
  success: boolean;
  message: string;
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
  success: boolean;
  message: string;
  deletedId: number;
}