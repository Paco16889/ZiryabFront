import { Teacher } from './teacher';
import { Enrollment } from './enrollment';

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
