
// models/subject.model.ts

export interface Subject {
  id: number;
  name: string;
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
  data: {
    id: number;
    name: string;
    idCourse: number;
    course: {
      id: number;
      name: string;
    };
  }[];
  count: number;
}

export interface SubjectCreateRequest {
  name: string;
  idCourse: number;
}

export interface SubjectCreateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    idCourse: number;
  };
}

export interface SubjectUpdateRequest {
  name: string;
  idCourse: number;
}

export interface SubjectUpdateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    idCourse: number;
  };
}

export interface SubjectDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}