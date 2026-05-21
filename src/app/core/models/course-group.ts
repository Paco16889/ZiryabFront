export interface CourseGroup {
  id: number;
  idCourse: number;
  course: { id: number; name: string };
  idGroup: number;
  group:   { id: number; name: string };
  /** "1" o "2" — curso dentro del ciclo */
  grade:   string;
  tutorId: number | null;
  tutor:   { id: number; name: string; surname: string } | null;
}

export interface CourseGroupsResponse {
  success: boolean;
  data: CourseGroup[];
  count: number;
}

export interface AssignTutorResponse {
  success: boolean;
  message: string;
  data: CourseGroup;
}
