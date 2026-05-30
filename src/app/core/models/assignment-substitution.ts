import { AssignmentStatus } from './assingment';

/** Profesor embebido en respuestas de sustitución (subset del API). */
export interface SubstitutionTeacherRef {
  id: number;
  name: string;
  surname?: string;
}

/** Assignment embebido en sustitución (subset del API). */
export interface SubstitutionTeacherAssignment {
  id: number;
  idTeacher: number;
  status: AssignmentStatus;
  currentSubstituteId?: number | null;
  schoolYear: string;
  isTutor?: boolean;
  teacher?: SubstitutionTeacherRef;
  subject?: {
    id: number;
    name: string;
    grade?: string;
    course?: { id: number; name: string };
  };
  group?: { id: number; name: string };
}

/** Registro de auditoría de sustitución (`AssignmentSubstitution`). */
export interface AssignmentSubstitution {
  id: number;
  idTeacherAssignment: number;
  idSubstitute: number;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  teacherAssignment?: SubstitutionTeacherAssignment;
  substitute?: SubstitutionTeacherRef;
}

/** Respuesta estándar del módulo `/api/assignment-substitutions`. */
export interface AssignmentSubstitutionsListResponse {
  success: boolean;
  data: AssignmentSubstitution[];
  count?: number;
}

export interface AssignmentSubstitutionByIdResponse {
  success: boolean;
  data: AssignmentSubstitution;
}

export interface AssignmentSubstitutionCreateRequest {
  idTeacherAssignment: number;
  idSubstitute: number;
  startDate?: string;
  endDate?: string | null;
  notes?: string;
}

export interface AssignmentSubstitutionCreateResponse {
  success: boolean;
  message?: string;
  data: AssignmentSubstitution;
}

export interface AssignmentSubstitutionCloseRequest {
  endDate: string;
}

export interface AssignmentSubstitutionCloseResponse {
  success: boolean;
  message?: string;
  data: AssignmentSubstitution;
}
