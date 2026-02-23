
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
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
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
  success: boolean;
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
  success: boolean;
  data: Teacher[];
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
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
  role?: string; // Opcional si siempre es TEACHER por defecto
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
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
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
  id: number;
  email: string;
  name: string;
  surname: string;
  ndSurname?: string;
  birthDate: string;
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
  success: boolean;
  data: {
    id: number;
    email: string;
    name: string;
    surname: string;
    ndSurname: string;
    birthDate: string;
    dni: string;
    role: string;
    firebaseUID: string;
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
  success: boolean;
  message: string;
  deletedId: number;
}