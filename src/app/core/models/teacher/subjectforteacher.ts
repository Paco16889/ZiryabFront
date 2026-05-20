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
  id: number;
  subject: {
    id: number;
    name: string;
    grade?: string;
    hours?: number;
    description?: string;
    idCourse?: number;
    course?: { id: number; name: string; description?: string; duration?: number; createdAt?: string };
  };
  group?: { id: number; name: string; capacity?: number } | null;
  schoolYear: string;
}

/**
 * Fila devuelta por GET /api/teachers/:id/subjects (TeacherOnSubjectOnGroup con includes).
 */
export interface TeacherSubjectAssignmentRow {
  id: number;
  idTeacher: number;
  idSubject: number;
  idGroup: number;
  schoolYear: string;
  status?: string;
  subject: {
    id: number;
    name: string;
    /** Curso académico de la asignatura (p. ej. `1º`) */
    grade?: string;
    /** Horas semanales si el API las incluye en el include de asignatura */
    hours?: number;
    course?: { id: number; name: string; description?: string; duration?: number; createdAt?: string };
  };
  group?: { id: number; name: string; capacity?: number } | null;
}

/** Asignación de profesor a asignatura tal como viene en GET /api/subjects/:id (include teacher). */
export type SubjectTeacherAssignment = Assignment & { teacher: Teacher };






// ── Entidades asociativas ─────────────────────────────────────────────────────



// ── Respuestas por endpoint ───────────────────────────────────────────────────

// GET /students/:id/subjects  →  getAsignaturasAlumno

export interface GetAsignaturasAlumnoResponse {
  success: boolean;
  data: StudentSubjectEnrollmentRow[];
  count: number;
}

// GET /teachers/:id/subjects  →  getAsignaturasProfesor


export interface GetAsignaturasProfesorResponse {
  success: boolean;
  data: TeacherSubjectAssignmentRow[];
  count: number;
}

// GET /subjects/:id  →  getNombreProfesorParaAsignatura
export interface SubjectDetail extends Subject {
  teacherAssignments: SubjectTeacherAssignment[];
  studentEnrollments: Enrollment[];
}

export interface GetSubjectDetailResponse {
  success: boolean;
  data: SubjectDetail;
}