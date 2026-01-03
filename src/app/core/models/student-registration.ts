// models/student-registration.model.ts

export interface StudentRegistration {
  idStudent: number;
  idGroup: number;
  idSubject: number;
  schoolYear: string;
}

export interface StudentRegistrationRequest {
  registrations: StudentRegistration[];
}

export interface StudentRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    created: number; // Número de registros creados
  };
}