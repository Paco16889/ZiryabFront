// models/week-schedule-flow/week-schedule-teacher-assignment-nested.model.ts

import type { Assignment } from '../assingment';
import type { Group } from '../group';
import type { Teacher } from '../teacher';

/**
 * Asignatura anidada en la asignación docente cuando el API hace include (subset de `Subject`).
 */
export interface WeekScheduleNestedSubject {
  id: number;
  name: string;
  grade?: string;
  hours?: number;
  description?: string;
  idCourse?: number;
  course?: {
    id: number;
    name: string;
    description?: string;
    duration?: number;
    createdAt?: string;
  };
}

/**
 * Grupo anidado en la asignación docente cuando el API hace include (subset de `Group`).
 */
export interface WeekScheduleNestedGroup extends Pick<Group, 'id' | 'name'> {
  capacity?: number;
}

/**
 * Profesor anidado en la asignación docente cuando el API hace include (subset de `Teacher`).
 */
export interface WeekScheduleNestedTeacher extends Pick<Teacher, 'id' | 'name' | 'surname' | 'email'> {
  ndSurname?: string;
  birthDate?: string;
  dni?: string;
  role?: string;
  firebaseUID?: string;
  createdAt?: string;
}

/**
 * Asignación profesor–asignatura–grupo con relaciones opcionales incluidas por el backend.
 * Usada dentro de `WeekScheduleApi` cuando la respuesta trae `teacher` / `subject` / `group`.
 */
export interface WeekScheduleAssignmentWithIncludes extends Assignment {
  teacher?: WeekScheduleNestedTeacher;
  subject?: WeekScheduleNestedSubject;
  group?: WeekScheduleNestedGroup;
}
