import { Subject } from "./subject";

export interface Course {
    id: number,
    name: string,
    subjects: Subject[];
}

export interface CourseByIdResponse {
  success: boolean;
  data: Course;
}

export interface CoursesAllResponse {
  success: boolean;
  data: Course[];
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

export interface CourseCreateRequest{
  name: string;
}
export interface CourseCreateResponse{
  success: boolean;
  data: {
    id: number;
    name: string;
  };
}