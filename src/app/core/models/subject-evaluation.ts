import { Enrollment } from './enrollment';
import { EvaluationPeriod } from './grade';

export { EvaluationPeriod };

/** Evaluación de una matrícula en un periodo (`SubjectEvaluation` en backend). */
export interface SubjectEvaluation {
  id: number;
  idStudentEnrollment: number;
  studentEnrollment?: Enrollment;
  period: EvaluationPeriod;
  value?: number;
  observations?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload para crear o actualizar una evaluación. */
export interface CreateSubjectEvaluationRequest {
  idStudentEnrollment: number;
  period: EvaluationPeriod;
  value?: number;
  observations?: string | null;
}

/** Guardado en lote desde la tabla de gestión de notas. */
export interface BulkCreateSubjectEvaluationsRequest {
  evaluations: CreateSubjectEvaluationRequest[];
}

/** Grupo tutorizado (`GET /api/subject-evaluations/tutored-groups`). */
export interface TutoredGroupForEvaluation {
  /** Id de `teacherOnSubjectOnGroup` (tutor assignment). */
  id: number;
  schoolYear: string;
  grade: string;
  course: { id: number; name: string };
  group: { id: number; name: string };
  studentEnrollments: Enrollment[];
}

/** Evaluaciones del alumno agrupadas por asignatura (`GET /my`). */
export interface MySubjectEvaluationsByEnrollment {
  enrollmentId: number;
  subjectId: number;
  subjectName: string;
  evaluations: SubjectEvaluation[];
}
