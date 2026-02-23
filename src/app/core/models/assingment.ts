

/**
 * Estado de la asignación de un profesor a una asignatura y grupo.
 * - ACTIVE: El profesor está actualmente impartiendo clase.
 * - SUSPENDED: Suspendido de empleo y sueldo.
 * - ILLNESS: Baja por enfermedad.
 * - EXCEDENCE: El profesor se encuentra en situación de excedencia.
 * - WITHDRAWN: Baja voluntaria en el puesto de trabajo.
 * - STANDBY: El profesor está en el sistema pero no imparte clase en ningún centro.
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
 * @example
 * const assignment: Assignment = {
 *   id: ID_ASSIGNMENT,
 *   idTeacher: ID_PROFESOR,
 *   idSubject: ID_ASIGNATURA,
 *   idGroup: ID_GRUPO,
 *   schoolYear: 'AÑO_ACADEMICO',
 *   status: 'ACTIVE'
 * };
 */
export interface Assignment {
  id: number;
  idTeacher: number;
  idSubject: number;
  idGroup: number;
  schoolYear: string;
  status: AssignmentStatus;
}


/**
 * Respuesta de la API al consultar todas las asignaciones.
 * @example
 * const response: AssignmentsAllResponse = {
 *   success: true,
 *   count: TOTAL_ASIGNACIONES,
 *   data: [
 *     {
 *       id: ID_ASSIGNMENT,
 *       idTeacher: ID_PROFESOR,
 *       idSubject: ID_ASIGNATURA,
 *       idGroup: ID_GRUPO,
 *       schoolYear: 'AÑO_ACADEMICO',
 *       status: 'ACTIVE'
 *     }
 *   ]
 * };
 */
export interface AssignmentsAllResponse {
  success: boolean;
  data: Assignment[];
  count: number;
}

/**
 * Respuesta de la API al consultar una asignación por su identificador.
 * @example
 * const response: AssignmentByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASSIGNMENT,
 *     idTeacher: ID_PROFESOR,
 *     idSubject: ID_ASIGNATURA,
 *     idGroup: ID_GRUPO,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'ACTIVE'
 *   }
 * };
 */
export interface AssignmentByIdResponse {
  success: boolean;
  data: Assignment;
}

/**
 * Datos necesarios para crear una nueva asignación.
 * @example
 * const request: AssignmentCreateRequest = {
 *   idTeacher: ID_PROFESOR,
 *   idSubject: ID_ASIGNATURA,
 *   idGroup: ID_GRUPO,
 *   schoolYear: 'AÑO_ACADEMICO'
 * };
 */
export interface AssignmentCreateRequest {
  idTeacher: number;
  idSubject: number;
  idGroup: number;
  schoolYear: string;
}

/**
 * Respuesta de la API tras crear una nueva asignación.
 * @example
 * const response: AssignmentCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASSIGNMENT,
 *     idTeacher: ID_PROFESOR,
 *     idSubject: ID_ASIGNATURA,
 *     idGroup: ID_GRUPO,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'ACTIVE'
 *   }
 * };
 */
export interface AssignmentCreateResponse {
  success: boolean;
  data: Assignment;
}

/**
 * Datos necesarios para actualizar una asignación existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: AssignmentUpdateRequest = {
 *   idTeacher: ID_PROFESOR,
 *   idSubject: ID_ASIGNATURA,
 *   idGroup: ID_GRUPO,
 *   schoolYear: 'AÑO_ACADEMICO',
 *   status: 'ACTIVE'
 * };
 */
export interface AssignmentUpdateRequest {
  idTeacher?: number;
  idSubject?: number;
  idGroup?: number;
  schoolYear?: string;
  status?: AssignmentStatus;
}

/**
 * Respuesta de la API tras actualizar una asignación.
 * @example
 * const response: AssignmentUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ASSIGNMENT,
 *     idTeacher: ID_PROFESOR,
 *     idSubject: ID_ASIGNATURA,
 *     idGroup: ID_GRUPO,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'ACTIVE'
 *   }
 * };
 */
export interface AssignmentUpdateResponse {
  success: boolean;
  data: Assignment;
}

/**
 * Respuesta de la API tras eliminar una asignación.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de assignments.
 * @example
 * const response: AssignmentDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_ASSIGNMENT',
 *   deletedId: ID_ASSIGNMENT
 * };
 */
export interface AssignmentDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}