// models/weekschedule.model.ts

import { Assignment } from "./assingment";

/**
 * Representa una franja horaria semanal asociada a la asignación de un profesor.
 * @example
 * const weekSchedule: WeekSchedule = {
 *   id: ID_HORARIO,
 *   weekDay: DIA_SEMANA_NUMERO,
 *   startTime: 'HORA_INICIO',
 *   finishTime: 'HORA_FIN',
 *   teacherAssignment: OBJETO_ASSIGNMENT
 * };
 */
export interface WeekSchedule {
  id: number;
  weekDay: number;
  startTime: string;
  finishTime: string;
  teacherAssignment: Assignment;
}

/**
 * Respuesta de la API al consultar todos los horarios semanales.
 * @example
 * const response: WeekSchedulesAllResponse = {
 *   success: true,
 *   count: TOTAL_HORARIOS,
 *   data: [
 *     {
 *       id: ID_HORARIO,
 *       weekDay: DIA_SEMANA_NUMERO,
 *       startTime: 'HORA_INICIO',
 *       finishTime: 'HORA_FIN',
 *       teacherAssignment: OBJETO_ASSIGNMENT
 *     }
 *   ]
 * };
 */
export interface WeekSchedulesAllResponse {
  success: boolean;
  data: WeekSchedule[];
  count: number;
}

/**
 * Respuesta de la API al consultar un horario semanal por su identificador.
 * @example
 * const response: WeekScheduleByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_HORARIO,
 *     weekDay: DIA_SEMANA_NUMERO,
 *     startTime: 'HORA_INICIO',
 *     finishTime: 'HORA_FIN',
 *     teacherAssignment: OBJETO_ASSIGNMENT
 *   }
 * };
 */
export interface WeekScheduleByIdResponse {
  success: boolean;
  data: WeekSchedule;
}

/**
 * Datos necesarios para crear una nueva franja horaria semanal.
 * @example
 * const request: WeekScheduleCreateRequest = {
 *   idTeacherAssignment: ID_ASSIGNMENT,
 *   weekDay: DIA_SEMANA_NUMERO,
 *   startTime: 'HORA_INICIO',
 *   finishTime: 'HORA_FIN'
 * };
 */
export interface WeekScheduleCreateRequest {
  idTeacherAssignment: number;
  weekDay: number;
  startTime: string;
  finishTime: string;
}

/**
 * Respuesta de la API tras crear una nueva franja horaria semanal.
 * @example
 * const response: WeekScheduleCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_HORARIO,
 *     weekDay: DIA_SEMANA_NUMERO,
 *     startTime: 'HORA_INICIO',
 *     finishTime: 'HORA_FIN',
 *     teacherAssignment: OBJETO_ASSIGNMENT
 *   }
 * };
 */
export interface WeekScheduleCreateResponse {
  success: boolean;
  data: WeekSchedule;
}

/**
 * Datos necesarios para actualizar una franja horaria semanal existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: WeekScheduleUpdateRequest = {
 *   weekDay: DIA_SEMANA_NUMERO,
 *   startTime: 'HORA_INICIO',
 *   finishTime: 'HORA_FIN'
 * };
 */
export interface WeekScheduleUpdateRequest {
  weekDay?: number;
  startTime?: string;
  finishTime?: string;
}

/**
 * Respuesta de la API tras actualizar una franja horaria semanal.
 * @example
 * const response: WeekScheduleUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_HORARIO,
 *     weekDay: DIA_SEMANA_NUMERO,
 *     startTime: 'HORA_INICIO',
 *     finishTime: 'HORA_FIN',
 *     teacherAssignment: OBJETO_ASSIGNMENT
 *   }
 * };
 */
export interface WeekScheduleUpdateResponse {
  success: boolean;
  data: WeekSchedule;
}

/**
 * Respuesta de la API tras eliminar una franja horaria semanal.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de weekschedules.
 * @example
 * const response: WeekScheduleDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_WEEKSCHEDULE',
 *   deletedId: ID_HORARIO
 * };
 */
export interface WeekScheduleDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}