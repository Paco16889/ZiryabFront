// models/weekschedule.model.ts

import { Assignment } from "./assingment";
import { WithId } from "./withId";

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
  /** Identificador único de la franja horaria */
  id: number;
  /** Día de la semana en formato numérico, donde 1 es lunes y 7 es domingo */
  weekDay: number;
  /** Hora de inicio de la franja horaria, por ejemplo '09:00' */
  startTime: string;
  /** Hora de fin de la franja horaria, por ejemplo '10:00' */
  finishTime: string;
  /** Etiqueta de clase agregada (p. ej. `1º DAM — Mañana`); presente en plantillas materializadas. */
  label?: string;
  /** Vacío en celdas de plantilla sin asignatura asignada aún. */
  teacherAssignment?: Assignment | null;
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de franjas horarias semanales */
  data: WeekSchedule[];
  /** Número total de franjas horarias devueltas */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la franja horaria encontrada */
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
  /** Identificador de la asignación del profesor a la que pertenece la franja */
  idTeacherAssignment: number;
  /** Día de la semana en formato numérico, donde 1 es lunes y 7 es domingo */
  weekDay: number;
  /** Hora de inicio de la franja horaria, por ejemplo '09:00' */
  startTime: string;
  /** Hora de fin de la franja horaria, por ejemplo '10:00' */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la franja horaria creada */
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
export interface WeekScheduleUpdateRequest extends WithId{
  /** Asignación docente a vincular en una celda de plantilla vacía. */
  idTeacherAssignment?: number;
  /** Nuevo día de la semana en formato numérico */
  weekDay?: number;
  /** Nueva hora de inicio de la franja horaria */
  startTime?: string;
  /** Nueva hora de fin de la franja horaria */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la franja horaria actualizada */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la franja horaria eliminada */
  deletedId: number;
}