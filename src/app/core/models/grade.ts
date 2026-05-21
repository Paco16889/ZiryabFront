import { Teacher } from './teacher';
import { Enrollment } from './enrollment';

/** Clase tutorada que devuelve GET /api/grades/tutored-groups */
export interface TutoredCourseGroup {
  id: number;
  grade: string; // "1" o "2"
  course: { id: number; name: string };
  group: { id: number; name: string };
  studentEnrollments: Enrollment[];
}

export enum EvaluationPeriod {
  INITIAL = 'INITIAL',
  FIRST_TRIMESTER = 'FIRST_TRIMESTER',
  SECOND_TRIMESTER = 'SECOND_TRIMESTER',
  THIRD_TRIMESTER = 'THIRD_TRIMESTER',
  FINAL = 'FINAL',
}

export interface Grade {
  id: number;
  idStudentEnrollment: number;
  studentEnrollment?: Enrollment;
  period: EvaluationPeriod;
  value?: number;
  observations?: string;
  idTeacher: number;
  teacher?: Teacher;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGradeRequest {
  idStudentEnrollment: number;
  period: EvaluationPeriod;
  value?: number;
  observations?: string;
}

export interface BulkCreateGradesRequest {
  grades: CreateGradeRequest[];
}

export interface MyGradesResponse {
  enrollmentId: number;
  subjectId: number;
  subjectName: string;
  grades: Grade[];
}
