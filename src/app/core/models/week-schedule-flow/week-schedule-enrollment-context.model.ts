// models/week-schedule-flow/week-schedule-enrollment-context.model.ts

import type { Enrollment, EnrollmentStatus } from '../enrollment';

/**
 * Matrícula con `subject` y `group` populados (filtros por asignatura + grupo + año al armar horarios por clase).
 */
export interface EnrollmentWithSubjectAndGroup extends Enrollment {
  subject?: {
    id: number;
    name: string;
    hours?: number;
    grade?: string;
    description?: string;
    idCourse?: number;
  };
  group?: {
    id: number;
    name: string;
    capacity?: number;
  };
}

/**
 * Respuesta de la API al listar matrículas con contexto para el flujo de horarios
 * (mismo patrón que `EnrollmentsAllResponse`: `success`, `data`, `count`).
 */
export interface EnrollmentsForScheduleContextResponse {
  success: boolean;
  data: EnrollmentWithSubjectAndGroup[];
  count: number;
}

/**
 * Clave para cruzar matrículas con la oferta docente (`TeacherOnSubjectOnGroup`).
 */
export interface SubjectGroupYearKey {
  idSubject: number;
  idGroup: number;
  schoolYear: string;
}

/**
 * Vista agregada: una asignatura en un grupo y curso escolar (deducida de matrículas).
 */
export interface SubjectInGroupForYearSlice {
  key: SubjectGroupYearKey;
  subject?: EnrollmentWithSubjectAndGroup['subject'];
  group?: EnrollmentWithSubjectAndGroup['group'];
  enrollmentStatusSample?: EnrollmentStatus;
}
