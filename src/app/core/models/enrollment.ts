// models/enrollment.model.ts
import { Student } from './student';
import { Subject } from './subject';
import { Group } from './group';
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
  /** Identificador único de la matrícula */
  id: number;
  /** Identificador del estudiante matriculado */
  idStudent: number;
  /** Identificador del grupo en el que está matriculado */
  idGroup: number;
  /** Identificador de la asignatura en la que está matriculado */
  idSubject: number;
  /** Año académico de la matrícula, por ejemplo '2024-2025' */
  schoolYear: string;
  /** Estado actual de la matrícula */
  status: EnrollmentStatus;
  /** Datos completos del estudiante*/
  student?: Student;
  /** Datos completos de la asignatura */
  subject?: Subject;
  /** Datos completos del grupo */
  group?: Group;
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de matrículas */
  data: Enrollment[];
  /** Número total de matrículas devueltas */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la matrícula encontrada */
  data: Enrollment;
}


/**
 * Parámetros necesarios para filtrar estudiantes
 * por asignatura, grupo y año académico.
 */
export interface StudentByFiltersRequest {
  /** Identificador de la asignatura */
  idSubject: number;

  /** Identificador del grupo */
  idGroup: number;

  /** Año académico (ej: '2024-2025') */
  schoolYear: string;
}


/**
 * Respuesta de la API al consultar las matrículas filtradas por asignatura,
 * grupo y año académico. Cada elemento incluye la matrícula y los datos
 * completos del estudiante asociado.
 *
 * @example
 * const response: EnrollmentByFiltersResponse = {
 *   success: true,
 *   count: TOTAL_MATRICULAS,
 *   data: [
 *     {
 *       id: ID_ENROLLMENT,
 *       idStudent: ID_ESTUDIANTE,
 *       idGroup: ID_GRUPO,
 *       idSubject: ID_ASIGNATURA,
 *       schoolYear: '2024-2025',
 *       status: 'ENROLLED',
 *       student: { ...Student }
 *     }
 *   ]
 * };
 */


export interface EnrollmentByFiltersResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;

  /** Número total de matrículas devueltas */
  count: number;

  /** Listado de matrículas filtradas con su estudiante asociado */
  data: {
    /** Identificador único de la matrícula */
    id: number;

    /** Identificador del estudiante matriculado */
    idStudent: number;

    /** Identificador del grupo en el que está matriculado */
    idGroup: number;

    /** Identificador de la asignatura en la que está matriculado */
    idSubject: number;

    /** Año académico de la matrícula, por ejemplo '2024-2025' */
    schoolYear: string;

    /** Estado actual de la matrícula */
    status: EnrollmentStatus;

    /** Datos completos del estudiante asociado */
    student: Student;
  }[];
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
  /** Identificador del estudiante a matricular */
  idStudent: number;
  /** Identificador del grupo en el que se matricula */
  idGroup: number;
  /** Identificador de la asignatura en la que se matricula */
  idSubject: number;
  /** Año académico de la matrícula, por ejemplo '2024-2025' */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la matrícula creada */
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
  /** Nuevo identificador del estudiante */
  idStudent?: number;
  /** Nuevo identificador del grupo */
  idGroup?: number;
  /** Nuevo identificador de la asignatura */
  idSubject?: number;
  /** Nuevo año académico */
  schoolYear?: string;
  /** Nuevo estado de la matrícula */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos de la matrícula actualizada */
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
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador de la matrícula eliminada */
  deletedId: number;
}