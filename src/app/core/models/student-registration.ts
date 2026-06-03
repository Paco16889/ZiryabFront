// models/student-registration.model.ts

/**
 * Representa una matrícula individual de un estudiante en una asignatura y grupo.
 * @example
 * const registration: StudentRegistration = {
 *   idStudent: ID_ESTUDIANTE,
 *   idGroup: ID_GRUPO,
 *   idSubject: ID_ASIGNATURA,
 *   schoolYear: 'AÑO_ACADEMICO'
 * };
 */
export interface StudentRegistration {
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
 * Cuerpo de la petición para registrar una o varias matrículas de estudiantes.
 * @example
 * const request: StudentRegistrationRequest = {
 *   registrations: [
 *     {
 *       idStudent: ID_ESTUDIANTE,
 *       idGroup: ID_GRUPO,
 *       idSubject: ID_ASIGNATURA,
 *       schoolYear: 'AÑO_ACADEMICO'
 *     }
 *   ]
 * };
 */
export interface StudentRegistrationRequest {
  /** Listado de matrículas a registrar */
  registrations: StudentRegistration[];
}

/**
 * Respuesta del backend tras ejecutar el registro de matrículas.
 * @example
 * const response: StudentRegistrationResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_REGISTRO',
 *   data: {
 *     created: TOTAL_REGISTROS_CREADOS
 *   }
 * };
 */
export interface StudentRegistrationResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Datos del resultado de la operación */
  data: {
    /** Número de registros de matrícula creados correctamente */
    created: number;
  };
}