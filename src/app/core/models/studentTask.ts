// models/student-task.model.ts

import { Task } from "./task";
import { Enrollment } from "./enrollment";

/**
 * Estado de la entrega de una tarea por parte de un estudiante.
 * - PENDING: Pendiente de entregar.
 * - SUBMITTED: Entregada en plazo.
 * - LATE: Entregada fuera de plazo.
 * - GRADED: Calificada por el profesor.
 * - NOT_SUBMITTED: No entregada tras superar la fecha límite.
 */
export enum SubmissionStatus {
  PENDING = 'PENDING',
  SUBMITTED = 'SUBMITTED',
  LATE = 'LATE',
  GRADED = 'GRADED',
  NOT_SUBMITTED = 'NOT_SUBMITTED'
}

/**
 * Representa la entrega de una tarea por parte de un estudiante.
 * @example
 * const studentTask: StudentTask = {
 *   id: ID_ENTREGA,
 *   idTask: ID_TAREA,
 *   task: OBJETO_TASK,
 *   idStudentEnrollment: ID_ENROLLMENT,
 *   studentEnrollment: OBJETO_ENROLLMENT,
 *   status: SubmissionStatus.PENDING,
 *   submissionDate: 'FECHA_ENTREGA',
 *   score: NOTA,
 *   feedback: 'COMENTARIOS_PROFESOR',
 *   attachmentUrl: 'URL_ARCHIVO'
 * };
 */
export interface StudentTask {
  id: number;
  idTask: number;
  task: Task;
  idStudentEnrollment: number;
  studentEnrollment: Enrollment;
  status: SubmissionStatus;
  submissionDate: string | null;
  score: number | null;
  feedback: string | null;
  attachmentUrl: string | null;
}

/**
 * Respuesta de la API al consultar todas las entregas de tareas.
 * @example
 * const response: StudentTasksAllResponse = {
 *   success: true,
 *   count: TOTAL_ENTREGAS,
 *   data: [
 *     {
 *       id: ID_ENTREGA,
 *       idTask: ID_TAREA,
 *       task: OBJETO_TASK,
 *       idStudentEnrollment: ID_ENROLLMENT,
 *       studentEnrollment: OBJETO_ENROLLMENT,
 *       status: SubmissionStatus.PENDING,
 *       submissionDate: null,
 *       score: null,
 *       feedback: null,
 *       attachmentUrl: null
 *     }
 *   ]
 * };
 */
export interface StudentTasksAllResponse {
  success: boolean;
  data: StudentTask[];
  count: number;
}

/**
 * Respuesta de la API al consultar una entrega de tarea por su identificador.
 * @example
 * const response: StudentTaskByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENTREGA,
 *     idTask: ID_TAREA,
 *     task: OBJETO_TASK,
 *     idStudentEnrollment: ID_ENROLLMENT,
 *     studentEnrollment: OBJETO_ENROLLMENT,
 *     status: SubmissionStatus.GRADED,
 *     submissionDate: 'FECHA_ENTREGA',
 *     score: NOTA,
 *     feedback: 'COMENTARIOS_PROFESOR',
 *     attachmentUrl: 'URL_ARCHIVO'
 *   }
 * };
 */
export interface StudentTaskByIdResponse {
  success: boolean;
  data: StudentTask;
}

/**
 * Datos necesarios para crear una nueva entrega de tarea.
 * Los campos submissionDate, score, feedback y attachmentUrl son opcionales.
 * @example
 * const request: StudentTaskCreateRequest = {
 *   idTask: ID_TAREA,
 *   idStudentEnrollment: ID_ENROLLMENT,
 *   status: SubmissionStatus.SUBMITTED,
 *   submissionDate: 'FECHA_ENTREGA',
 *   attachmentUrl: 'URL_ARCHIVO'
 * };
 */
export interface StudentTaskCreateRequest {
  idTask: number;
  idStudentEnrollment: number;
  status?: SubmissionStatus;
  submissionDate?: string;
  score?: number;
  feedback?: string;
  attachmentUrl?: string;
}

/**
 * Respuesta de la API tras crear una nueva entrega de tarea.
 * @example
 * const response: StudentTaskCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENTREGA,
 *     idTask: ID_TAREA,
 *     task: OBJETO_TASK,
 *     idStudentEnrollment: ID_ENROLLMENT,
 *     studentEnrollment: OBJETO_ENROLLMENT,
 *     status: SubmissionStatus.SUBMITTED,
 *     submissionDate: 'FECHA_ENTREGA',
 *     score: null,
 *     feedback: null,
 *     attachmentUrl: 'URL_ARCHIVO'
 *   }
 * };
 */
export interface StudentTaskCreateResponse {
  success: boolean;
  data: StudentTask;
}

/**
 * Datos necesarios para actualizar una entrega de tarea existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: StudentTaskUpdateRequest = {
 *   status: SubmissionStatus.GRADED,
 *   score: NOTA,
 *   feedback: 'COMENTARIOS_PROFESOR'
 * };
 */
export interface StudentTaskUpdateRequest {
  status?: SubmissionStatus;
  submissionDate?: string;
  score?: number;
  feedback?: string;
  attachmentUrl?: string;
}

/**
 * Respuesta de la API tras actualizar una entrega de tarea.
 * @example
 * const response: StudentTaskUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENTREGA,
 *     idTask: ID_TAREA,
 *     task: OBJETO_TASK,
 *     idStudentEnrollment: ID_ENROLLMENT,
 *     studentEnrollment: OBJETO_ENROLLMENT,
 *     status: SubmissionStatus.GRADED,
 *     submissionDate: 'FECHA_ENTREGA',
 *     score: NOTA,
 *     feedback: 'COMENTARIOS_PROFESOR',
 *     attachmentUrl: 'URL_ARCHIVO'
 *   }
 * };
 */
export interface StudentTaskUpdateResponse {
  success: boolean;
  data: StudentTask;
}

/**
 * Respuesta de la API tras eliminar una entrega de tarea.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de student-tasks.
 * @example
 * const response: StudentTaskDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_STUDENTTASK',
 *   deletedId: ID_ENTREGA
 * };
 */
export interface StudentTaskDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}