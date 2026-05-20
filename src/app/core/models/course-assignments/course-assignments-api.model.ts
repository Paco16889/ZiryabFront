import { AssignmentWithIncludes } from '../assingment';

/** Grades distintos de `Subject.grade` en un ciclo (p. ej. `"1"`, `"2"`). */
export type CourseGradesResponse = {
  success: boolean;
  data: string[];
  count?: number;
};

export type CourseSubjectOfferItem = {
  id: number;
  name: string;
  grade: string;
  hours?: number;
  description?: string;
  idCourse: number;
};

export type CourseSubjectsByGradeResponse = {
  success: boolean;
  data: CourseSubjectOfferItem[];
  count?: number;
};

export type CourseAssignmentsByOfferResponse = {
  success: boolean;
  data: AssignmentWithIncludes[];
  count?: number;
};

/** Ítem para alta de asignación docente (bulk o unitario). */
export interface AssignmentBulkCreateItem {
  idTeacher: number;
  idSubject: number;
  idGroup: number;
  schoolYear: string;
}

export type AssignmentBulkCreateResult = {
  created: number;
  duplicates: number;
  skipped: number;
  errors: Array<{ idSubject: number; message: string }>;
};

export type AssignmentBulkCreateResponse = {
  success: boolean;
  data?: AssignmentBulkCreateResult;
  message?: string;
};
