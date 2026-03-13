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
  /** Identificador único de la entrega */
  id: number;
  /** Identificador de la tarea asociada a la entrega */
  idTask: number;
  /** Datos completos de la tarea asociada */
  task: Task;
  /** Identificador de la matrícula del estudiante que realiza la entrega */
  idStudentEnrollment: number;
  /** Datos completos de la matrícula del estudiante */
  studentEnrollment: Enrollment;
  /** Estado actual de la entrega */
  status: SubmissionStatus;
  /** Fecha en la que se realizó la entrega, null si aún no se ha entregado */
  submissionDate: string | null;
  /** Nota obtenida en la tarea, null si aún no ha sido calificada */
  score: number | null;
  /** Comentarios del profesor sobre la entrega, null si no hay feedback */
  feedback: string | null;
  /** URL del archivo adjunto de la entrega, null si no hay adjunto */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de entregas de tareas */
  data: StudentTask[];
  /** Número total de entregas devueltas */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la entrega encontrada */
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
  /** Identificador de la tarea a entregar */
  idTask: number;
  /** Identificador de la matrícula del estudiante que realiza la entrega */
  idStudentEnrollment: number;
  /** Estado inicial de la entrega, opcional */
  status?: SubmissionStatus;
  /** Fecha de entrega, opcional */
  submissionDate?: string;
  /** Nota obtenida, opcional */
  score?: number;
  /** Comentarios del profesor, opcional */
  feedback?: string;
  /** URL del archivo adjunto, opcional */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la entrega creada */
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
  /** Nuevo estado de la entrega */
  status?: SubmissionStatus;
  /** Nueva fecha de entrega */
  submissionDate?: string;
  /** Nueva nota obtenida */
  score?: number;
  /** Nuevos comentarios del profesor */
  feedback?: string;
  /** Nueva URL del archivo adjunto */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la entrega actualizada */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la entrega eliminada */
  deletedId: number;
}