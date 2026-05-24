// models/week-schedule-flow/week-schedule.interfaces.ts

import type { PrismaWeekDay } from './week-schedule.enums';
import type { WeekScheduleAssignmentWithIncludes } from './week-schedule-teacher-assignment-nested.model';

/**
 * Franja semanal tal como viene en el JSON del backend (antes de normalizar `weekDay` a 1–7 en UI).
 * Complementa `WeekSchedule` en `core/models/week-schedule.ts`, que representa la vista ya normalizada.
 */
export interface WeekScheduleApi {
  /** Identificador de la franja semanal persistida. */
  id: number;

  /** Día de la semana en literal Prisma o número si ya fue normalizado. */
  weekDay: PrismaWeekDay | number;

  /** Hora de inicio en formato `HH:mm`. */
  startTime: string;

  /** Hora de finalización en formato `HH:mm`. */
  finishTime: string;

  /** Asignación docente asociada, normalmente con profesor/asignatura/grupo anidados. */
  teacherAssignment: WeekScheduleAssignmentWithIncludes;
}

/**
 * Respuesta de la API al listar todas las franjas (mismo patrón que `WeekSchedulesAllResponse`).
 */
export interface WeekSchedulesAllApiResponse {
  /** Indica si el listado se obtuvo correctamente. */
  success: boolean;

  /** Franjas semanales devueltas por el backend. */
  data: WeekScheduleApi[];

  /** Número total de franjas devueltas. */
  count: number;
}

/**
 * Respuesta de la API al obtener una franja por id (mismo patrón que `WeekScheduleByIdResponse`).
 */
export interface WeekScheduleByIdApiResponse {
  /** Indica si la franja fue encontrada correctamente. */
  success: boolean;

  /** Franja semanal solicitada con relaciones anidadas. */
  data: WeekScheduleApi;
}

/**
 * Cuerpo enviado en **POST** `/horarios-semanales`: `weekDay` en formato Prisma (no el 1–7 de la UI).
 * Complementa `WeekScheduleCreateRequest` del modelo principal (día numérico en formulario).
 */
export interface WeekScheduleCreateApiRequest {
  /** Asignación profesor-asignatura-grupo que ocupará la franja. */
  idTeacherAssignment: number;

  /** Día en formato Prisma esperado por el backend. */
  weekDay: PrismaWeekDay;

  /** Hora de inicio de la franja. */
  startTime: string;

  /** Hora de finalización de la franja. */
  finishTime: string;
}

/**
 * Respuesta de la API tras crear una franja (mismo patrón que `WeekScheduleCreateResponse`, con entidad API).
 */
export interface WeekScheduleCreateApiResponse {
  /** Indica si la creación finalizó correctamente. */
  success: boolean;

  /** Franja creada tal como la devuelve el backend. */
  data: WeekScheduleApi;
}

/**
 * Cuerpo enviado en **PATCH** `/horarios-semanales/:id` (solo campos presentes).
 * El backend puede requerir `id` en el cuerpo según implementación.
 */
export interface WeekScheduleUpdateApiRequest {
  /** Identificador de la franja cuando el backend lo requiere también en el cuerpo. */
  id?: number;

  /** Nuevo día en formato Prisma. */
  weekDay?: PrismaWeekDay;

  /** Nueva hora de inicio. */
  startTime?: string;

  /** Nueva hora de finalización. */
  finishTime?: string;
}

/**
 * Respuesta de la API tras actualizar una franja (mismo patrón que `WeekScheduleUpdateResponse`).
 */
export interface WeekScheduleUpdateApiResponse {
  /** Indica si la actualización finalizó correctamente. */
  success: boolean;

  /** Franja actualizada tal como la devuelve el backend. */
  data: WeekScheduleApi;
}

export type {
  WeekScheduleMaterializeRequest,
  WeekScheduleMaterializeSlot,
} from './week-schedule-materialize.model';
