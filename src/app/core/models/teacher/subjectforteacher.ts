// ── Entidades base ────────────────────────────────────────────────────────────

import { Assignment } from "../assingment";
import { Course } from "../course";
import { Enrollment } from "../enrollment";
import { Group } from "../group";
import { Student } from "../student";
import { Subject } from "../subject";
import { Teacher } from "../teacher";






// ── Entidades asociativas ─────────────────────────────────────────────────────



// ── Respuestas por endpoint ───────────────────────────────────────────────────

// GET /students/:id/subjects  →  getAsignaturasAlumno

export interface GetAsignaturasAlumnoResponse {
  success: boolean;
  data: Enrollment[];
  count: number;
}

// GET /teachers/:id/subjects  →  getAsignaturasProfesor


export interface GetAsignaturasProfesorResponse {
  success: boolean;
  data: Assignment[];
  count: number;
}

// GET /subjects/:id  →  getNombreProfesorParaAsignatura
export interface SubjectDetail extends Subject {
  teacherAssignments: Assignment[];
  studentEnrollments: Enrollment[];
}

export interface GetSubjectDetailResponse {
  success: boolean;
  data: SubjectDetail;
}