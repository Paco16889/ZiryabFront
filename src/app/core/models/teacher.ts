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
    subject: {
      idSubject: number;
      idTeacher: number;
      subject: {
        id: number;
        name: string;
        idCourse: number;
        course: {
          id: number;
          name: string;
        };
      };
    }[];
    
}

// models/teacher.model.ts



export interface TeacherByIdResponse {
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
    subject: {
      idSubject: number;
      idTeacher: number;
      subject: {
        id: number;
        name: string;
        idCourse: number;
        course: {
          id: number;
          name: string;
        };
      };
    }[];
  };
}

export interface TeachersAllResponse {
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
  }[];
  // No hay count en este caso
}

export interface TeacherCreateRequest {
  email: string;
  name: string;
  surname: string;
  ndSurname: string;
  birthDate: string;
  dni: string;
  role?: string; // Opcional si siempre es TEACHER por defecto
}

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

export interface TeacherUpdateRequest {
  id: number;
  email: string;
  name: string;
  surname: string;
  ndSurname?: string;
  birthDate: string;
  dni: string;
}

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

export interface TeacherDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}