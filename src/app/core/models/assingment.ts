/**
 * Estado de la asignación de un profesor a una asignatura y grupo.
 * - ACTIVE: el profesor está actualmente impartiendo clase.
 * - SUSPENDED: suspendido de empleo y sueldo.
 * - ILLNESS: baja por enfermedad.
 * - EXCEDENCE: el profesor se encuentra en situación de excedencia.
 * - WITHDRAWN: baja voluntaria en el puesto de trabajo.
 * - STANDBY: el profesor está en el sistema pero no imparte clase en ningún centro.
 */
export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  ILLNESS = 'ILLNESS',
  EXCEDENCE = 'EXCEDENCE',
  WITHDRAWN = 'WITHDRAWN',
  STANDBY = 'STANDBY'
}

/**
 * Representa la asignación de un profesor a una asignatura y grupo en un año académico concreto.
 */
export interface Assignment {
  /** Identificador único de la asignación */
  id: number;
  /** Identificador del profesor asignado */
  idTeacher: number;
  /** Identificador de la asignatura impartida */
  idSubject: number;
  /** Identificador del grupo al que se imparte */
  idGroup: number;
  /** Año académico de la asignación, por ejemplo '2024-2025' */
  schoolYear: string;
  /** Estado actual de la asignación */
  status: AssignmentStatus;
}

/**
 * Respuesta de la API al consultar todas las asignaciones.
 */
export interface AssignmentsAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de asignaciones */
  data: Assignment[];
  /** Número total de asignaciones devueltas */
  count: number;
}

/**
 * Respuesta de la API al consultar una asignación por su identificador.
 */
export interface AssignmentByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la asignación encontrada */
  data: Assignment;
}

/**
 * Datos necesarios para crear una nueva asignación.
 */
export interface AssignmentCreateRequest {
  /** Identificador del profesor a asignar */
  idTeacher: number;
  /** Identificador de la asignatura a impartir */
  idSubject: number;
  /** Identificador del grupo al que se imparte */
  idGroup: number;
  /** Año académico de la asignación, por ejemplo '2024-2025' */
  schoolYear: string;
}

/**
 * Respuesta de la API tras crear una nueva asignación.
 */
export interface AssignmentCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la asignación creada */
  data: Assignment;
}

/**
 * Datos necesarios para actualizar una asignación existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 */
export interface AssignmentUpdateRequest {
  /** Identificador del nuevo profesor asignado */
  idTeacher?: number;
  /** Identificador de la nueva asignatura */
  idSubject?: number;
  /** Identificador del nuevo grupo */
  idGroup?: number;
  /** Nuevo año académico */
  schoolYear?: string;
  /** Nuevo estado de la asignación */
  status?: AssignmentStatus;
}

/**
 * Respuesta de la API tras actualizar una asignación.
 */
export interface AssignmentUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la asignación actualizada */
  data: Assignment;
}

/**
 * Respuesta de la API tras eliminar una asignación.
 */
export interface AssignmentDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la asignación eliminada */
  deletedId: number;
}