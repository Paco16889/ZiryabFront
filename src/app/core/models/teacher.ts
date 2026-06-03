/**
 * Representa un profesor del sistema.
 * @example
 * const teacher: Teacher = {
 *   id: ID_PROFESOR,
 *   email: 'EMAIL_PROFESOR',
 *   name: 'NOMBRE_PROFESOR',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_PROFESOR',
 *   role: 'TEACHER',
 *   firebaseUID: 'FIREBASE_UID',
 *   createdAt: 'FECHA_CREACION'
 * };
 */
export interface Teacher {
  /** Identificador único del profesor */
  id: number;
  /** Correo electrónico del profesor */
  email: string;
  /** Nombre del profesor */
  name: string;
  /** Primer apellido del profesor */
  surname: string;
  /** Segundo apellido del profesor */
  ndSurname: string;
  /** Fecha de nacimiento del profesor */
  birthDate: string;
  /** DNI del profesor */
  dni: string;
  /** Rol del profesor en el sistema */
  role: string;
  /** Identificador único del profesor en Firebase */
  firebaseUID: string;
  /** Fecha de creación del registro */
  createdAt: string;
}

/**
 * Respuesta de la API al consultar un profesor por su identificador.
 * @example
 * const response: TeacherByIdResponse = {
 *   success: true,
 *   data: {
 *     id: ID_PROFESOR,
 *     email: 'EMAIL_PROFESOR',
 *     name: 'NOMBRE_PROFESOR',
 *     surname: 'PRIMER_APELLIDO',
 *     ndSurname: 'SEGUNDO_APELLIDO',
 *     birthDate: 'FECHA_NACIMIENTO',
 *     dni: 'DNI_PROFESOR',
 *     role: 'TEACHER',
 *     firebaseUID: 'FIREBASE_UID',
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface TeacherByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del profesor encontrado */
  data: Teacher;
}

/**
 * Respuesta de la API al consultar todos los profesores.
 * @example
 * const response: TeachersAllResponse = {
 *   success: true,
 *   count: TOTAL_PROFESORES,
 *   data: [
 *     {
 *       id: ID_PROFESOR,
 *       email: 'EMAIL_PROFESOR',
 *       name: 'NOMBRE_PROFESOR',
 *       surname: 'PRIMER_APELLIDO',
 *       ndSurname: 'SEGUNDO_APELLIDO',
 *       birthDate: 'FECHA_NACIMIENTO',
 *       dni: 'DNI_PROFESOR',
 *       role: 'TEACHER',
 *       firebaseUID: 'FIREBASE_UID',
 *       createdAt: 'FECHA_CREACION'
 *     }
 *   ]
 * };
 */
export interface TeachersAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de profesores */
  data: Teacher[];
  /** Número total de profesores devueltos */
  count: number;
}

/**
 * Datos necesarios para crear un nuevo profesor.
 * El campo role es opcional, por defecto el backend asignará TEACHER.
 * @example
 * const request: TeacherCreateRequest = {
 *   email: 'EMAIL_PROFESOR',
 *   name: 'NOMBRE_PROFESOR',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_PROFESOR'
 * };
 */
export interface TeacherCreateRequest {
  /** Correo electrónico del profesor */
  email: string;
  /** Nombre del profesor */
  name: string;
  /** Primer apellido del profesor */
  surname: string;
  /** Segundo apellido del profesor */
  ndSurname: string;
  /** Fecha de nacimiento del profesor */
  birthDate: string;
  /** DNI del profesor */
  dni: string;
  /** Rol del profesor, por defecto TEACHER si no se indica */
  role?: string;
}

/**
 * Respuesta de la API tras crear un nuevo profesor.
 * @example
 * const response: TeacherCreateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_PROFESOR,
 *     email: 'EMAIL_PROFESOR',
 *     name: 'NOMBRE_PROFESOR',
 *     surname: 'PRIMER_APELLIDO',
 *     ndSurname: 'SEGUNDO_APELLIDO',
 *     birthDate: 'FECHA_NACIMIENTO',
 *     dni: 'DNI_PROFESOR',
 *     role: 'TEACHER',
 *     firebaseUID: 'FIREBASE_UID',
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface TeacherCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del profesor creado */
  data: {
    /** Identificador único del profesor creado */
    id: number;
    /** Correo electrónico del profesor */
    email: string;
    /** Nombre del profesor */
    name: string;
    /** Primer apellido del profesor */
    surname: string;
    /** Segundo apellido del profesor */
    ndSurname: string;
    /** Fecha de nacimiento del profesor */
    birthDate: string;
    /** DNI del profesor */
    dni: string;
    /** Rol del profesor en el sistema */
    role: string;
    /** Identificador único del profesor en Firebase */
    firebaseUID: string;
    /** Fecha de creación del registro */
    createdAt: string;
  };
}

/**
 * Datos necesarios para actualizar un profesor existente.
 * @example
 * const request: TeacherUpdateRequest = {
 *   id: ID_PROFESOR,
 *   email: 'EMAIL_PROFESOR',
 *   name: 'NOMBRE_PROFESOR',
 *   surname: 'PRIMER_APELLIDO',
 *   ndSurname: 'SEGUNDO_APELLIDO',
 *   birthDate: 'FECHA_NACIMIENTO',
 *   dni: 'DNI_PROFESOR'
 * };
 */
export interface TeacherUpdateRequest {
  /** Identificador único del profesor a actualizar */
  id: number;
  /** Nuevo correo electrónico del profesor */
  email: string;
  /** Nuevo nombre del profesor */
  name: string;
  /** Nuevo primer apellido del profesor */
  surname: string;
  /** Nuevo segundo apellido del profesor, opcional */
  ndSurname?: string;
  /** Nueva fecha de nacimiento del profesor */
  birthDate: string;
  /** Nuevo DNI del profesor */
  dni: string;
}

/**
 * Respuesta de la API tras actualizar un profesor.
 * @example
 * const response: TeacherUpdateResponse = {
 *   success: true,
 *   data: {
 *     id: ID_PROFESOR,
 *     email: 'EMAIL_PROFESOR',
 *     name: 'NOMBRE_PROFESOR',
 *     surname: 'PRIMER_APELLIDO',
 *     ndSurname: 'SEGUNDO_APELLIDO',
 *     birthDate: 'FECHA_NACIMIENTO',
 *     dni: 'DNI_PROFESOR',
 *     role: 'TEACHER',
 *     firebaseUID: 'FIREBASE_UID',
 *     createdAt: 'FECHA_CREACION'
 *   }
 * };
 */
export interface TeacherUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del profesor actualizado */
  data: {
    /** Identificador único del profesor actualizado */
    id: number;
    /** Correo electrónico del profesor */
    email: string;
    /** Nombre del profesor */
    name: string;
    /** Primer apellido del profesor */
    surname: string;
    /** Segundo apellido del profesor */
    ndSurname: string;
    /** Fecha de nacimiento del profesor */
    birthDate: string;
    /** DNI del profesor */
    dni: string;
    /** Rol del profesor en el sistema */
    role: string;
    /** Identificador único del profesor en Firebase */
    firebaseUID: string;
    /** Fecha de creación del registro */
    createdAt: string;
  };
}

/**
 * Respuesta de la API tras eliminar un profesor.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de teachers.
 * @example
 * const response: TeacherDeleteResponse = {
 *   success: true,
 *   message: 'MENSAJE_BACKEND_DELETE_TEACHER',
 *   deletedId: ID_PROFESOR
 * };
 */
export interface TeacherDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador del profesor eliminado */
  deletedId: number;
}