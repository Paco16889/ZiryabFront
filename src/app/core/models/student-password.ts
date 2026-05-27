/**
 * Registro de credenciales de alumno visible para tutor.
 */
export interface StudentPasswordByTutor {
  idStudent: number;
  studentName: string;
  password: string;
  idTutor?: number;
  studentEmail?: string;
}

/**
 * Respuesta del backend para la consulta por tutor.
 */
export interface GetByTutorResponse {
  success: boolean;
  data: StudentPasswordByTutor[];
}
