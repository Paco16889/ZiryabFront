// models/task.model.ts

import { Assignment } from "./assingment";

/**
 * Tipo de tarea asignada por el profesor.
 * - PRACTICE: Práctica.
 * - THEORY: Teoría, trabajo o material.
 * - EXAM: Examen.
 * - PROJECT: Proyecto.
 * - HOMEWORK: Deberes.
 */
export enum TaskType {
  PRACTICE = 'PRACTICE',
  THEORY = 'THEORY',
  EXAM = 'EXAM',
  PROJECT = 'PROJECT',
  HOMEWORK = 'HOMEWORK'
}

/**
 * Representa una tarea asignada por un profesor a un grupo en un año académico concreto.
 * @example
 * const task: Task = {
 *   id: ID_TAREA,
 *   idTeacherAssignment: ID_ASSIGNMENT,
 *   teacherAssignment: OBJETO_ASSIGNMENT,
 *   title: 'TITULO_TAREA',
 *   description: 'DESCRIPCION_TAREA',
 *   type: TaskType.PRACTICE,
 *   startDate: 'FECHA_INICIO',
 *   dueDate: 'FECHA_LIMITE',
 *   schoolYear: 'AÑO_ACADEMICO'
 * };
 */
export interface Task {
  id: number;
  idTeacherAssignment: number;
  teacherAssignment: Assignment;
  title: string;
  description: string | null;
  type: TaskType;
  startDate: string;
  dueDate: string;
  schoolYear: string;
}

/**
 * Respuesta de la API al consultar todas las tareas.
 * @example
 * const response: TasksAllResponse = {
 *   success: true,
 *   count: TOTAL_TAREAS,
 *   data: [
 *     {
 *       id: ID_TAREA,
 *       idTeacherAssignment: ID_ASSIGNMENT,
 *       teacherAssignment: OBJETO_ASSIGNMENT,
 *       title: 'TITULO_TAREA',
 *       description: 'DESCRIPCION_TAREA',
 *       type: TaskType.PRACTICE,
 *       startDate: 'FECHA_INICIO',
 *       dueDate: 'FECHA_LIMITE',
 *       schoolYear: 'AÑO_ACADEMICO'
 *     }
 *   ]
 * };
 */
export interface TasksAllResponse {
  success: boolean;
  data: Task[];
  count: number;
}

/**
 * Respuesta de la API al consultar una tarea por su identificador.
 * @example
 * const response: TaskByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_TAREA,
 *     idTeacherAssignment: ID_ASSIGNMENT,
 *     teacherAssignment: OBJETO_ASSIGNMENT,
 *     title: 'TITULO_TAREA',
 *     description: 'DESCRIPCION_TAREA',
 *     type: TaskType.EXAM,
 *     startDate: 'FECHA_INICIO',
 *     dueDate: 'FECHA_LIMITE',
 *     schoolYear: 'AÑO_ACADEMICO'
 *   }
 * };
 */
export interface TaskByIdResponse {
  success: boolean;
  data: Task;
}

/**
 * Datos necesarios para crear una nueva tarea.
 * El campo description es opcional.
 * @example
 * const request: TaskCreateRequest = {
 *   idTeacherAssignment: ID_ASSIGNMENT,
 *   title: 'TITULO_TAREA',
 *   description: 'DESCRIPCION_TAREA',
 *   type: TaskType.HOMEWORK,
 *   startDate: 'FECHA_INICIO',
 *   dueDate: 'FECHA_LIMITE',
 *   schoolYear: 'AÑO_ACADEMICO'
 * };
 */
export interface TaskCreateRequest {
  idTeacherAssignment: number;
  title: string;
  description?: string;
  type: TaskType;
  startDate: string;
  dueDate: string;
  schoolYear: string;
}

/**
 * Respuesta de la API tras crear una nueva tarea.
 * @example
 * const response: TaskCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_TAREA,
 *     idTeacherAssignment: ID_ASSIGNMENT,
 *     teacherAssignment: OBJETO_ASSIGNMENT,
 *     title: 'TITULO_TAREA',
 *     description: 'DESCRIPCION_TAREA',
 *     type: TaskType.HOMEWORK,
 *     startDate: 'FECHA_INICIO',
 *     dueDate: 'FECHA_LIMITE',
 *     schoolYear: 'AÑO_ACADEMICO'
 *   }
 * };
 */
export interface TaskCreateResponse {
  success: boolean;
  data: Task;
}

/**
 * Datos necesarios para actualizar una tarea existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: TaskUpdateRequest = {
 *   title: 'TITULO_TAREA',
 *   description: 'DESCRIPCION_TAREA',
 *   type: TaskType.PROJECT,
 *   startDate: 'FECHA_INICIO',
 *   dueDate: 'FECHA_LIMITE'
 * };
 */
export interface TaskUpdateRequest {
  title?: string;
  description?: string;
  type?: TaskType;
  startDate?: string;
  dueDate?: string;
}

/**
 * Respuesta de la API tras actualizar una tarea.
 * @example
 * const response: TaskUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_TAREA,
 *     idTeacherAssignment: ID_ASSIGNMENT,
 *     teacherAssignment: OBJETO_ASSIGNMENT,
 *     title: 'TITULO_TAREA',
 *     description: 'DESCRIPCION_TAREA',
 *     type: TaskType.PROJECT,
 *     startDate: 'FECHA_INICIO',
 *     dueDate: 'FECHA_LIMITE',
 *     schoolYear: 'AÑO_ACADEMICO'
 *   }
 * };
 */
export interface TaskUpdateResponse {
  success: boolean;
  data: Task;
}

/**
 * Respuesta de la API tras eliminar una tarea.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de tasks.
 * @example
 * const response: TaskDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_TASK',
 *   deletedId: ID_TAREA
 * };
 */
export interface TaskDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}