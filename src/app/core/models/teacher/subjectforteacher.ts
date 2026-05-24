// ── Entidades base ────────────────────────────────────────────────────────────

import { Assignment } from "../assingment";
import { Enrollment } from "../enrollment";
import { Subject } from "../subject";
import { Teacher } from "../teacher";

/**
 * Fila devuelta por GET /api/students/:id/subjects (matrícula con asignatura y grupo).
 * Coincide con `findSubjectsByStudentId` en el backend (subject + group incluidos).
 */
export interface StudentSubjectEnrollmentRow {
  /** Identificador de la matrícula alumno-asignatura-grupo. */
  id: number;

  /** Asignatura matriculada con datos suficientes para vistas del alumno. */
  subject: {
    /** Identificador de la asignatura. */
    id: number;
    /** Nombre visible de la asignatura. */
    name: string;
    /** Nivel/curso de la asignatura. */
    grade?: string;
    /** Horas semanales declaradas. */
    hours?: number;
    /** Descripción opcional de la asignatura. */
    description?: string;
    /** Ciclo al que pertenece la asignatura. */
    idCourse?: number;
    /** Ciclo anidado cuando el backend expande la relación. */
    course?: { id: number; name: string; description?: string; duration?: number; createdAt?: string };
  };

  /** Grupo de la matrícula, si el backend lo incluye. */
  group?: { id: number; name: string; capacity?: number } | null;

  /** Curso escolar de la matrícula. */
  schoolYear: string;
}

/**
 * Fila devuelta por GET /api/teachers/:id/subjects (TeacherOnSubjectOnGroup con includes).
 */
export interface TeacherSubjectAssignmentRow {
  /** Identificador de la asignación docente. */
  id: number;

  /** Profesor asignado. */
  idTeacher: number;

  /** Asignatura impartida. */
  idSubject: number;

  /** Grupo al que se imparte la asignatura. */
  idGroup: number;

  /** Curso escolar de la asignación. */
  schoolYear: string;

  /** Estado administrativo de la asignación. */
  status?: string;

  /** Asignatura anidada usada por horarios y listados del profesor. */
  subject: {
    /** Identificador de la asignatura. */
    id: number;
    /** Nombre visible de la asignatura. */
    name: string;
    /** Curso académico de la asignatura (p. ej. `1º`) */
    grade?: string;
    /** Horas semanales si el API las incluye en el include de asignatura */
    hours?: number;
    /** Ciclo anidado para filtrar por curso en el builder de horarios. */
    course?: { id: number; name: string; description?: string; duration?: number; createdAt?: string };
  };

  /** Grupo asociado a la asignación, si el backend lo expande. */
  group?: { id: number; name: string; capacity?: number } | null;
}

/** Asignación de profesor a asignatura tal como viene en GET /api/subjects/:id (include teacher). */
export type SubjectTeacherAssignment = Assignment & { teacher: Teacher };






// ── Entidades asociativas ─────────────────────────────────────────────────────



// ── Respuestas por endpoint ───────────────────────────────────────────────────

// GET /students/:id/subjects  →  getAsignaturasAlumno

/** Respuesta con las asignaturas en las que está matriculado un alumno. */
export interface GetAsignaturasAlumnoResponse {
  /** Indica si la consulta se completó correctamente. */
  success: boolean;

  /** Matrículas con asignatura y grupo anidados. */
  data: StudentSubjectEnrollmentRow[];

  /** Número de filas devueltas. */
  count: number;
}

// GET /teachers/:id/subjects  →  getAsignaturasProfesor


/** Respuesta con las asignaciones docente-asignatura-grupo de un profesor. */
export interface GetAsignaturasProfesorResponse {
  /** Indica si la consulta se completó correctamente. */
  success: boolean;

  /** Asignaciones docentes del profesor. */
  data: TeacherSubjectAssignmentRow[];

  /** Número de filas devueltas. */
  count: number;
}

// GET /subjects/:id  →  getNombreProfesorParaAsignatura
/** Detalle de asignatura con profesores asignados y matrículas relacionadas. */
export interface SubjectDetail extends Subject {
  /** Profesores asignados a la asignatura. */
  teacherAssignments: SubjectTeacherAssignment[];

  /** Matrículas de alumnos asociadas a la asignatura. */
  studentEnrollments: Enrollment[];
}

/** Respuesta con el detalle completo de una asignatura. */
export interface GetSubjectDetailResponse {
  /** Indica si la consulta se completó correctamente. */
  success: boolean;

  /** Asignatura con relaciones usadas por profesor/alumno. */
  data: SubjectDetail;
}