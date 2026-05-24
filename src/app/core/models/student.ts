/**
 * Representa un estudiante del sistema.
 * @example
 * const student: Student = {
 *   id: ID_ESTUDIANTE,
 *   email: 'EMAIL_ESTUDIANTE',
 *   name: 'NOMBRE_ESTUDIANTE',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_ESTUDIANTE',
 *   role: 'STUDENT',
 *   firebaseUID: 'FIREBASE_UID',
 *   createdAt: 'FECHA_CREACION'
 * };
 */
export interface Student {
  /** Identificador único del estudiante */
  id: number;
  /** Correo electrónico del estudiante */
  email: string;
  /** Nombre del estudiante */
  name: string;
  /** Primer apellido del estudiante */
  surname: string;
  /** Segundo apellido del estudiante */
  ndSurname: string;
  /** Fecha de nacimiento del estudiante */
  birthDate: string;
  /** DNI o NIE del estudiante */
  dni: string;
  /** Rol del estudiante en el sistema */
  role: string;
  /** Identificador único del estudiante en Firebase */
  firebaseUID: string;
  /** Fecha de creación del registro */
  createdAt: string;
}

/**
 * Respuesta de la API al consultar un estudiante por su identificador.
 * @example
 * const response: StudentByIdResponse = {
 *   success: true,
 *   data: Student
 * };
 */
export interface StudentByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del estudiante encontrado */
  data: Student;
}

/**
 * Respuesta de la API al consultar todos los estudiantes.
 * @example
 * const response: StudentsAllResponse = {
 *   success: true,
 *   count: TOTAL_ESTUDIANTES,
 *   data: [
 *     {
 *       id: ID_ESTUDIANTE,
 *       email: 'EMAIL_ESTUDIANTE',
 *       name: 'NOMBRE_ESTUDIANTE',
 *       surname: 'PRIMER_APELLIDO',
 *       ndSurname: 'SEGUNDO_APELLIDO',
 *       birthDate: 'FECHA_NACIMIENTO',
 *       dni: 'DNI_ESTUDIANTE',
 *       role: 'STUDENT',
 *       firebaseUID: 'FIREBASE_UID',
 *       isActive: true,
 *       createdAt: 'FECHA_CREACION'
 *     }
 *   ]
 * };
 */
export interface StudentsAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de estudiantes */
  data: Student[];
  /** Número total de estudiantes devueltos */
  count: number;
}

/**
 * Datos necesarios para crear un nuevo estudiante.
 * El campo role es opcional, por defecto el backend asignará STUDENT.
 * @example
 * const request: StudentCreateRequest = {
 *   email: 'EMAIL_ESTUDIANTE',
 *   name: 'NOMBRE_ESTUDIANTE',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_ESTUDIANTE'
 * };
 */
/** Datos del paso 2 del wizard, solo en memoria hasta confirmar matrícula (EQ-311-A). */
export interface PendingStudentDraft {
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
}

export interface StudentCreateRequest {
  /** Correo electrónico del estudiante */
  email: string;
  /** Nombre del estudiante */
  name: string;
  /** Primer apellido del estudiante */
  surname: string;
  /** Segundo apellido del estudiante */
  ndSurname: string;
  /** Fecha de nacimiento del estudiante */
  birthDate: string;
  /** DNI o NIE del estudiante */
  dni: string;
  /** UID de Firebase, requerido al persistir en backend */
  firebaseUID?: string;
  /** Rol del estudiante, por defecto STUDENT si no se indica */
  role?: string;
}

/**
 * Respuesta de la API tras crear un nuevo estudiante.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta POST de students.
 * @example
 * const response: StudentCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ESTUDIANTE,
 *     email: 'EMAIL_ESTUDIANTE',
 *     name: 'NOMBRE_ESTUDIANTE',
 *     surname: 'PRIMER_APELLIDO',
 *     ndSurname: 'SEGUNDO_APELLIDO',
 *     birthDate: 'FECHA_NACIMIENTO',
 *     dni: 'DNI_ESTUDIANTE',
 *     role: 'STUDENT',
 *     firebaseUID: 'FIREBASE_UID',
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface StudentCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del estudiante creado */
  data: {
    /** Identificador único del estudiante creado */
    id: number;
    /** Correo electrónico del estudiante */
    email: string;
    /** Nombre del estudiante */
    name: string;
    /** Primer apellido del estudiante */
    surname: string;
    /** Segundo apellido del estudiante */
    ndSurname: string;
    /** Fecha de nacimiento del estudiante */
    birthDate: string;
    /** DNI o NIE del estudiante */
    dni: string;
    /** Rol del estudiante en el sistema */
    role: string;
    /** Identificador único del estudiante en Firebase */
    firebaseUID: string;
    /** Fecha de creación del registro */
    createdAt: string;
  };
}

/**
 * Datos necesarios para actualizar un estudiante existente.
 * @example
 * const request: StudentUpdateRequest = {
 *   id: ID_ESTUDIANTE,
 *   email: 'EMAIL_ESTUDIANTE',
 *   name: 'NOMBRE_ESTUDIANTE',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_ESTUDIANTE'
 * };
 */
export interface StudentUpdateRequest {
  /** Identificador único del estudiante a actualizar */
  id: number;
  /** Nuevo correo electrónico del estudiante */
  email: string;
  /** Nuevo nombre del estudiante */
  name: string;
  /** Nuevo primer apellido del estudiante */
  surname: string;
  /** Nuevo segundo apellido del estudiante */
  ndSurname: string;
  /** Nueva fecha de nacimiento del estudiante */
  birthDate: string;
  /** Nuevo DNI o NIE del estudiante */
  dni: string;
}

/**
 * Respuesta de la API tras actualizar un estudiante.
 * @example
 * const response: StudentUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_ESTUDIANTE,
 *     email: 'EMAIL_ESTUDIANTE',
 *     name: 'NOMBRE_ESTUDIANTE',
 *     surname: 'PRIMER_APELLIDO',
 *     ndSurname: 'SEGUNDO_APELLIDO',
 *     birthDate: 'FECHA_NACIMIENTO',
 *     dni: 'DNI_ESTUDIANTE',
 *     role: 'STUDENT',
 *     firebaseUID: 'FIREBASE_UID',
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface StudentUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del estudiante actualizado */
  data: {
    /** Identificador único del estudiante actualizado */
    id: number;
    /** Correo electrónico del estudiante */
    email: string;
    /** Nombre del estudiante */
    name: string;
    /** Primer apellido del estudiante */
    surname: string;
    /** Segundo apellido del estudiante */
    ndSurname: string;
    /** Fecha de nacimiento del estudiante */
    birthDate: string;
    /** DNI o NIE del estudiante */
    dni: string;
    /** Rol del estudiante en el sistema */
    role: string;
    /** Identificador único del estudiante en Firebase */
    firebaseUID: string;
    /** Fecha de creación del registro */
    createdAt: string;
  };
}

/**
 * Respuesta de la API tras eliminar un estudiante.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de students.
 * @example
 * const response: StudentDeleteResponse = {
 *   success: true
 * };
 */
export interface StudentDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
}