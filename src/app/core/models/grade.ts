import { Teacher } from './teacher';
import { Enrollment } from './enrollment';

/** Clase tutorada que devuelve `GET /api/grades/tutored-groups`. */
export interface TutoredCourseGroup {
  /** Identificador de la relación ciclo–grupo. */
  id: number;

  /** Curso dentro del ciclo (`"1"` o `"2"`). */
  grade: string;

  /** Ciclo formativo del grupo. */
  course: { id: number; name: string };

  /** Grupo académico tutorizado. */
  group: { id: number; name: string };

  /** Matrículas de alumnos del grupo para el tutor. */
  studentEnrollments: Enrollment[];
}

/** Periodos evaluables disponibles para calificaciones de una matrícula. */
export enum EvaluationPeriod {
  INITIAL = 'INITIAL',
  FIRST_TRIMESTER = 'FIRST_TRIMESTER',
  SECOND_TRIMESTER = 'SECOND_TRIMESTER',
  THIRD_TRIMESTER = 'THIRD_TRIMESTER',
  FINAL = 'FINAL',
}

/** Calificación registrada por un profesor para una matrícula y periodo. */
export interface Grade {
  /** Identificador de la calificación. */
  id: number;

  /** Matrícula del alumno en la asignatura evaluada. */
  idStudentEnrollment: number;

  /** Matrícula expandida cuando el endpoint la incluye. */
  studentEnrollment?: Enrollment;

  /** Periodo de evaluación al que pertenece la nota. */
  period: EvaluationPeriod;

  /** Valor numérico de la calificación, si ya se ha informado. */
  value?: number;

  /** Observaciones del profesor asociadas a la calificación. */
  observations?: string;

  /** Profesor que registró la calificación. */
  idTeacher: number;

  /** Datos del profesor cuando el backend expande la relación. */
  teacher?: Teacher;

  /** Fecha de creación de la calificación. */
  createdAt: Date;

  /** Fecha de última actualización de la calificación. */
  updatedAt: Date;
}

/** Payload para crear o actualizar una calificación individual. */
export interface CreateGradeRequest {
  /** Matrícula del alumno que recibe la nota. */
  idStudentEnrollment: number;

  /** Periodo evaluado. */
  period: EvaluationPeriod;

  /** Valor numérico opcional. */
  value?: number;

  /** Observaciones opcionales del profesor. */
  observations?: string;
}

/** Payload usado por la vista de gestión para guardar varias calificaciones. */
export interface BulkCreateGradesRequest {
  /** Calificaciones que se enviarán en lote. */
  grades: CreateGradeRequest[];
}

/** Agrupación de notas que ve el alumno por asignatura. */
export interface MyGradesResponse {
  /** Matrícula de la asignatura. */
  enrollmentId: number;

  /** Identificador de la asignatura. */
  subjectId: number;

  /** Nombre de la asignatura mostrado al alumno. */
  subjectName: string;

  /** Notas registradas para la asignatura. */
  grades: Grade[];
}
