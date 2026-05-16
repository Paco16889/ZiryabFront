// models/week-schedule-flow/week-schedule.interfaces.ts

import type { PrismaWeekDay } from './week-schedule.enums';
import type { WeekScheduleAssignmentWithIncludes } from './week-schedule-teacher-assignment-nested.model';

/**
 * Franja semanal tal como viene en el JSON del backend (antes de normalizar `weekDay` a 1–7 en UI).
 * Complementa `WeekSchedule` en `core/models/week-schedule.ts`, que representa la vista ya normalizada.
 */
export interface WeekScheduleApi {
  id: number;
  weekDay: PrismaWeekDay | number;
  startTime: string;
  finishTime: string;
  teacherAssignment: WeekScheduleAssignmentWithIncludes;
}

/**
 * Respuesta de la API al listar todas las franjas (mismo patrón que `WeekSchedulesAllResponse`).
 */
export interface WeekSchedulesAllApiResponse {
  success: boolean;
  data: WeekScheduleApi[];
  count: number;
}

/**
 * Respuesta de la API al obtener una franja por id (mismo patrón que `WeekScheduleByIdResponse`).
 */
export interface WeekScheduleByIdApiResponse {
  success: boolean;
  data: WeekScheduleApi;
}

/**
 * Cuerpo enviado en **POST** `/horarios-semanales`: `weekDay` en formato Prisma (no el 1–7 de la UI).
 * Complementa `WeekScheduleCreateRequest` del modelo principal (día numérico en formulario).
 */
export interface WeekScheduleCreateApiRequest {
  idTeacherAssignment: number;
  weekDay: PrismaWeekDay;
  startTime: string;
  finishTime: string;
}

/**
 * Respuesta de la API tras crear una franja (mismo patrón que `WeekScheduleCreateResponse`, con entidad API).
 */
export interface WeekScheduleCreateApiResponse {
  success: boolean;
  data: WeekScheduleApi;
}

/**
 * Cuerpo enviado en **PATCH** `/horarios-semanales/:id` (solo campos presentes).
 * El backend puede requerir `id` en el cuerpo según implementación.
 */
export interface WeekScheduleUpdateApiRequest {
  id?: number;
  weekDay?: PrismaWeekDay;
  startTime?: string;
  finishTime?: string;
}

/**
 * Respuesta de la API tras actualizar una franja (mismo patrón que `WeekScheduleUpdateResponse`).
 */
export interface WeekScheduleUpdateApiResponse {
  success: boolean;
  data: WeekScheduleApi;
}
