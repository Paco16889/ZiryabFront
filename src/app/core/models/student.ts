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
 * Respuesta de la API al consultar un estudiante por su identificador.
 * @example
 * const response: StudentByIdResponse = {
 *   success: true,
 *   data: Student
 * };
 */
export interface StudentByIdResponse {
  success: boolean;
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
  success: boolean;
  data: Student[];
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
export interface StudentCreateRequest {
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
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
  id: number;
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
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
 * Respuesta de la API tras eliminar un estudiante.
 * El campo message lo devuelve tu backend, consúltalo en el controlador
 * correspondiente a la ruta DELETE de students.
 * @example
 * const response: StudentDeleteResponse = {
 *   success: true
 * };
 */
export interface StudentDeleteResponse{
    success: boolean;
  }