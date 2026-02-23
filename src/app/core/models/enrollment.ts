// models/enrollment.model.ts

/**
 * Estado de la matrícula de un estudiante en una asignatura y grupo.
 * - ENROLLED: Matriculado y cursando.
 * - EVALUATION_LOST: Evaluación perdida.
 * - COMPLETED: Asignatura superada.
 * - FAILED: Asignatura suspensa.
 * - WITHDRAWN: Baja voluntaria.
 * - EXPELLED: Expulsado.
 */
export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  EVALUATION_LOST = 'EVALUATION_LOST',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  WITHDRAWN = 'WITHDRAWN',
  EXPELLED = 'EXPELLED'
}
/**
 * Representa la matrícula de un estudiante en una asignatura y grupo en un año académico concreto.
 * @example
 * const enrollment: Enrollment = {
 *   id: ID_ENROLLMENT,
 *   idStudent: ID_ESTUDIANTE,
 *   idGroup: ID_GRUPO,
 *   idSubject: ID_ASIGNATURA,
 *   schoolYear: 'AÑO_ACADEMICO',
 *   status: 'ENROLLED'
 * };
 */
export interface Enrollment {
  id: number;
  idStudent: number;
  idGroup: number;
  idSubject: number;
  schoolYear: string;
  status: EnrollmentStatus;
}

/**
 * Respuesta de la API al consultar todas las matrículas.
 * @example
 * const response: EnrollmentsAllResponse = {
 *   success: true,
 *   count: TOTAL_MATRICULAS,
 *   data: [
 *     {
 *       id: ID_ENROLLMENT,
 *       idStudent: ID_ESTUDIANTE,
 *       idGroup: ID_GRUPO,
 *       idSubject: ID_ASIGNATURA,
 *       schoolYear: 'AÑO_ACADEMICO',
 *       status: 'ENROLLED'
 *     }
 *   ]
 * };
 */
export interface EnrollmentsAllResponse {
  success: boolean;
  data: Enrollment[];
  count: number;
}

/**
 * Respuesta de la API al consultar una matrícula por su identificador.
 * @example
 * const response: EnrollmentByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENROLLMENT,
 *     idStudent: ID_ESTUDIANTE,
 *     idGroup: ID_GRUPO,
 *     idSubject: ID_ASIGNATURA,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'ENROLLED'
 *   }
 * };
 */
export interface EnrollmentByIdResponse {
  success: boolean;
  data: Enrollment;
}

/**
 * Datos necesarios para crear una nueva matrícula.
 * @example
 * const request: EnrollmentCreateRequest = {
 *   idStudent: ID_ESTUDIANTE,
 *   idGroup: ID_GRUPO,
 *   idSubject: ID_ASIGNATURA,
 *   schoolYear: 'AÑO_ACADEMICO'
 * };
 */
export interface EnrollmentCreateRequest {
  idStudent: number;
  idGroup: number;
  idSubject: number;
  schoolYear: string;
}

/**
 * Respuesta de la API tras crear una nueva matrícula.
 * @example
 * const response: EnrollmentCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENROLLMENT,
 *     idStudent: ID_ESTUDIANTE,
 *     idGroup: ID_GRUPO,
 *     idSubject: ID_ASIGNATURA,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'ENROLLED'
 *   }
 * };
 */
export interface EnrollmentCreateResponse {
  success: boolean;
  data: Enrollment;
}

/**
 * Datos necesarios para actualizar una matrícula existente.
 * Todos los campos son opcionales, se actualizan solo los que se envíen.
 * @example
 * const request: EnrollmentUpdateRequest = {
 *   idStudent: ID_ESTUDIANTE,
 *   idGroup: ID_GRUPO,
 *   idSubject: ID_ASIGNATURA,
 *   schoolYear: 'AÑO_ACADEMICO',
 *   status: 'COMPLETED'
 * };
 */
export interface EnrollmentUpdateRequest {
  idStudent?: number;
  idGroup?: number;
  idSubject?: number;
  schoolYear?: string;
  status?: EnrollmentStatus;
}

/**
 * Respuesta de la API tras actualizar una matrícula.
 * @example
 * const response: EnrollmentUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ENROLLMENT,
 *     idStudent: ID_ESTUDIANTE,
 *     idGroup: ID_GRUPO,
 *     idSubject: ID_ASIGNATURA,
 *     schoolYear: 'AÑO_ACADEMICO',
 *     status: 'COMPLETED'
 *   }
 * };
 */
export interface EnrollmentUpdateResponse {
  success: boolean;
  data: Enrollment;
}

/**
 * Respuesta de la API tras eliminar una matrícula.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de enrollments.
 * @example
 * const response: EnrollmentDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_ENROLLMENT',
 *   deletedId: ID_ENROLLMENT
 * };
 */
export interface EnrollmentDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}