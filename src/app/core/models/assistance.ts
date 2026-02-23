// models/assistance.model.ts

import { ClassSession } from "./class-sessions";
import { Enrollment } from "./enrollment";

/**
 * Estado de asistencia de un estudiante a una sesión de clase.
 * - PRESENT: Asistió a clase.
 * - MISSING: Faltó a clase.
 * - LAG: Llegó tarde.
 * - JUSTIFY: Falta justificada.
 */
export enum AssistanceStatus {
  PRESENT = 'PRESENT',
  MISSING = 'MISSING',
  LAG = 'LAG',
  JUSTIFY = 'JUSTIFY'
}

/**
 * Representa el registro de asistencia de un estudiante a una sesión de clase concreta.
 * @example
 * const assistance: Assistance = {
 *   id: ID_ASISTENCIA,
 *   status: AssistanceStatus.PRESENT,
 *   session: OBJETO_CLASSSESSION,
 *   studentEnrollment: OBJETO_ENROLLMENT
 * };
 */
export interface Assistance {
  id: number;
  status: AssistanceStatus;
  session: ClassSession;
  studentEnrollment: Enrollment;
}

/**
 * Respuesta de la API al consultar todos los registros de asistencia.
 * @example
 * const response: AssistancesAllResponse = {
 *   success: true,
 *   count: TOTAL_ASISTENCIAS,
 *   data: [
 *     {
 *       id: ID_ASISTENCIA,
 *       status: AssistanceStatus.PRESENT,
 *       session: OBJETO_CLASSSESSION,
 *       studentEnrollment: OBJETO_ENROLLMENT
 *     }
 *   ]
 * };
 */
export interface AssistancesAllResponse {
  success: boolean;
  data: Assistance[];
  count: number;
}

/**
 * Respuesta de la API al consultar un registro de asistencia por su identificador.
 * @example
 * const response: AssistanceByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASISTENCIA,
 *     status: AssistanceStatus.PRESENT,
 *     session: OBJETO_CLASSSESSION,
 *     studentEnrollment: OBJETO_ENROLLMENT
 *   }
 * };
 */
export interface AssistanceByIdResponse {
  success: boolean;
  data: Assistance;
}

/**
 * Datos necesarios para registrar una nueva asistencia.
 * El campo status es opcional, por defecto el backend asignará PRESENT.
 * @example
 * const request: AssistanceCreateRequest = {
 *   idSession: ID_SESION,
 *   idStudentEnrollment: ID_ENROLLMENT,
 *   status: AssistanceStatus.PRESENT
 * };
 */
export interface AssistanceCreateRequest {
  idSession: number;
  idStudentEnrollment: number;
  status?: AssistanceStatus;
}

/**
 * Respuesta de la API tras registrar una nueva asistencia.
 * @example
 * const response: AssistanceCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASISTENCIA,
 *     status: AssistanceStatus.PRESENT,
 *     session: OBJETO_CLASSSESSION,
 *     studentEnrollment: OBJETO_ENROLLMENT
 *   }
 * };
 */
export interface AssistanceCreateResponse {
  success: boolean;
  data: Assistance;
}

/**
 * Datos necesarios para actualizar un registro de asistencia existente.
 * @example
 * const request: AssistanceUpdateRequest = {
 *   status: AssistanceStatus.JUSTIFY
 * };
 */
export interface AssistanceUpdateRequest {
  status: AssistanceStatus;
}

/**
 * Respuesta de la API tras actualizar un registro de asistencia.
 * @example
 * const response: AssistanceUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASISTENCIA,
 *     status: AssistanceStatus.JUSTIFY,
 *     session: OBJETO_CLASSSESSION,
 *     studentEnrollment: OBJETO_ENROLLMENT
 *   }
 * };
 */
export interface AssistanceUpdateResponse {
  success: boolean;
  data: Assistance;
}

/**
 * Respuesta de la API tras eliminar un registro de asistencia.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de assistances.
 * @example
 * const response: AssistanceDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_ASSISTANCE',
 *   deletedId: ID_ASISTENCIA
 * };
 */
export interface AssistanceDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}