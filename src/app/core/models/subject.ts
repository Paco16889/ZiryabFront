
// models/subject.model.ts

export interface Subject {
  id: number;
  name: string;
  grade: string;
  idCourse: number;
  course: {
    id: number;
    name: string;
  };
}

export interface SubjectByIdResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    idCourse: number;
    course: {
      id: number;
      name: string;
    };
  };
}

export interface SubjectsAllResponse {
  success: boolean;
  data: Subject[];
  count: number;
}

export interface SubjectCreateRequest {
  name: string;
  idCourse: number;
}

export interface SubjectCreateResponse {
  success: boolean;
  message: string;
  data: Subject;
}

export interface SubjectUpdateRequest {
  name: string;
  grade: string;
  idCourse: number;
}

export interface SubjectUpdateResponse {
  success: boolean;
  data: Subject;
}

export interface SubjectDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}