// models/week-schedule-flow/week-schedule-enrollment-context.model.ts

import type { Enrollment, EnrollmentStatus } from '../enrollment';

/**
 * Matrícula con `subject` y `group` populados (filtros por asignatura + grupo + año al armar horarios por clase).
 */
export interface EnrollmentWithSubjectAndGroup extends Enrollment {
  /** Asignatura de la matrícula; puede venir omitida si el endpoint no expande relaciones. */
  subject?: {
    /** Identificador de la asignatura. */
    id: number;
    /** Nombre visible de la asignatura. */
    name: string;
    /** Horas semanales declaradas para controlar exceso de horas en el grid. */
    hours?: number;
    /** Nivel académico al que pertenece la asignatura. */
    grade?: string;
    /** Descripción opcional de la asignatura. */
    description?: string;
    /** Ciclo/curso asociado a la asignatura. */
    idCourse?: number;
  };

  /** Grupo de la matrícula; se usa para cruzar alumnado, asignaturas y horarios. */
  group?: {
    /** Identificador del grupo. */
    id: number;
    /** Nombre visible del grupo. */
    name: string;
    /** Capacidad máxima configurada para el grupo. */
    capacity?: number;
  };
}

/**
 * Respuesta de la API al listar matrículas con contexto para el flujo de horarios
 * (mismo patrón que `EnrollmentsAllResponse`: `success`, `data`, `count`).
 */
export interface EnrollmentsForScheduleContextResponse {
  /** Indica si el backend pudo resolver matrículas con relaciones de contexto. */
  success: boolean;

  /** Matrículas filtradas por asignatura, grupo y curso escolar. */
  data: EnrollmentWithSubjectAndGroup[];

  /** Número de matrículas devueltas. */
  count: number;
}

/**
 * Clave para cruzar matrículas con la oferta docente (`TeacherOnSubjectOnGroup`).
 */
export interface SubjectGroupYearKey {
  /** Asignatura de la que se busca oferta docente. */
  idSubject: number;

  /** Grupo académico donde se imparte la asignatura. */
  idGroup: number;

  /** Curso escolar que evita mezclar ofertas de años distintos. */
  schoolYear: string;
}

/**
 * Vista agregada: una asignatura en un grupo y curso escolar (deducida de matrículas).
 */
export interface SubjectInGroupForYearSlice {
  /** Clave compuesta que identifica asignatura, grupo y curso escolar. */
  key: SubjectGroupYearKey;

  /** Asignatura representativa de las matrículas agrupadas. */
  subject?: EnrollmentWithSubjectAndGroup['subject'];

  /** Grupo representativo de las matrículas agrupadas. */
  group?: EnrollmentWithSubjectAndGroup['group'];

  /** Estado de matrícula usado como muestra para la agrupación. */
  enrollmentStatusSample?: EnrollmentStatus;
}
