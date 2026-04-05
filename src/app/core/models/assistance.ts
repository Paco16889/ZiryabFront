import { ClassSession } from "./class-sessions";
import { Enrollment } from "./enrollment";

/**
 * Estado de asistencia de un estudiante a una sesión de clase.
 * - PRESENT: asistió a clase.
 * - MISSING: faltó a clase.
 * - LAG: llegó tarde.
 * - JUSTIFY: falta justificada.
 */
export enum AssistanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

/**
 * Representa el registro de asistencia de un estudiante a una sesión de clase concreta.
 */
export interface Assistance {
  /** Identificador único del registro de asistencia */
  id: number;
  /** Estado de asistencia del estudiante a la sesión */
  status: AssistanceStatus;
  /** Sesión de clase a la que corresponde el registro */
  session: ClassSession;
  /** Matrícula del estudiante asociada al registro de asistencia */
  studentEnrollment: Enrollment;
  /** URI de la justificación enviada */
  justificationUri?: string;
  /** Estado de la justificación (PENDING, VIEWED, etc.) */
  justificationStatus?: 'PENDING' | 'VIEWED' | 'REJECTED' | null;
}

/**
 * Respuesta de la API al consultar todos los registros de asistencia.
 */
export interface AssistancesAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de registros de asistencia */
  data: Assistance[];
  /** Número total de registros de asistencia devueltos */
  count: number;
}

/**
 * Respuesta de la API al consultar un registro de asistencia por su identificador.
 */
export interface AssistanceByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del registro de asistencia encontrado */
  data: Assistance;
}

/**
 * Datos necesarios para registrar una nueva asistencia.
 * El campo status es opcional, por defecto el backend asignará PRESENT.
 */
export interface AssistanceCreateRequest {
  /** Identificador de la sesión de clase a la que se registra la asistencia */
  idSession: number;
  /** Identificador de la matrícula del estudiante */
  idStudentEnrollment: number;
  /** Estado de asistencia, por defecto PRESENT si no se indica */
  status?: AssistanceStatus;
}

/**
 * Respuesta de la API tras registrar una nueva asistencia.
 */
export interface AssistanceCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del registro de asistencia creado */
  data: Assistance;
}

/**
 * Datos necesarios para actualizar un registro de asistencia existente.
 */
export interface AssistanceUpdateRequest {
  /** Nuevo estado de asistencia del estudiante */
  status: AssistanceStatus;
}

/**
 * Respuesta de la API tras actualizar un registro de asistencia.
 */
export interface AssistanceUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del registro de asistencia actualizado */
  data: Assistance;
}

/**
 * Respuesta de la API tras eliminar un registro de asistencia.
 */
export interface AssistanceDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador del registro de asistencia eliminado */
  deletedId: number;
}
export interface AssistanceItem {
  id: number;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  justificationUri?: string;
  justificationStatus?: 'PENDING' | 'VIEWED' | 'REJECTED' | null;
  session: {
    date: string;
    schedule: {
      startTime: string;
      teacherAssignment: {
        subject: {
          name: string;
        }
      }
    }
  }
}

export interface AssistanceResponse {
  success: boolean;
  data: AssistanceItem[];
  count: number;
}
