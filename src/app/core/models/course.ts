export interface Course {
    id: number,
    name: string,
    subjects: {
      id: number;
      name: string;
      idCourse:number;
    }[];
}

export interface CourseByIdResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    subjects: {
      id: number;
      name: string;
      idCourse: number;
    }[];
  };
}

export interface CoursesAllResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    subjects: {
      id: number;
      name: string;
      idCourse: number;
    }[];
  }[];
  count: number;  // ← Esta es la diferencia clave
}


// models/course.model.ts (añade estas)
export interface CourseUpdateRequest {
   id: number;
  name: string;
}

export interface CourseUpdateResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
  };
}

export interface CourseDeleteResponse {
  success: boolean;
  message: string;
  deletedId: number;
}