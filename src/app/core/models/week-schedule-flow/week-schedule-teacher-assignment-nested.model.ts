// models/week-schedule-flow/week-schedule-teacher-assignment-nested.model.ts

import type { Assignment } from '../assingment';
import type { Group } from '../group';
import type { Teacher } from '../teacher';

/**
 * Asignatura anidada en la asignación docente cuando el API hace include (subset de `Subject`).
 */
export interface WeekScheduleNestedSubject {
  /** Identificador de la asignatura. */
  id: number;

  /** Nombre visible de la asignatura. */
  name: string;

  /** Nivel/curso de la asignatura dentro del ciclo. */
  grade?: string;

  /** Horas semanales declaradas para validar el grid. */
  hours?: number;

  /** Descripción académica de la asignatura. */
  description?: string;

  /** Identificador del ciclo/curso al que pertenece. */
  idCourse?: number;

  /** Ciclo anidado cuando el backend incluye la relación completa. */
  course?: {
    /** Identificador del ciclo. */
    id: number;
    /** Nombre visible del ciclo. */
    name: string;
    /** Descripción opcional del ciclo. */
    description?: string;
    /** Duración del ciclo en años o cursos. */
    duration?: number;
    /** Fecha de creación del ciclo en backend. */
    createdAt?: string;
  };
}

/**
 * Grupo anidado en la asignación docente cuando el API hace include (subset de `Group`).
 */
export interface WeekScheduleNestedGroup extends Pick<Group, 'id' | 'name'> {
  /** Capacidad máxima del grupo, útil para informes y validaciones de matrícula. */
  capacity?: number;
}

/**
 * Profesor anidado en la asignación docente cuando el API hace include (subset de `Teacher`).
 */
export interface WeekScheduleNestedTeacher extends Pick<Teacher, 'id' | 'name' | 'surname' | 'email'> {
  /** Segundo apellido del profesor si está informado. */
  ndSurname?: string;

  /** Fecha de nacimiento cuando el endpoint reutiliza el modelo completo de profesor. */
  birthDate?: string;

  /** DNI del profesor cuando el endpoint lo incluye. */
  dni?: string;

  /** Rol del usuario asociado al profesor. */
  role?: string;

  /** UID de Firebase asociado al usuario profesor. */
  firebaseUID?: string;

  /** Fecha de creación del profesor en backend. */
  createdAt?: string;
}

/**
 * Asignación profesor–asignatura–grupo con relaciones opcionales incluidas por el backend.
 * Usada dentro de `WeekScheduleApi` cuando la respuesta trae `teacher` / `subject` / `group`.
 */
export interface WeekScheduleAssignmentWithIncludes extends Assignment {
  /** Profesor asignado a la franja si el backend expande la relación. */
  teacher?: WeekScheduleNestedTeacher;

  /** Asignatura asignada a la franja si el backend expande la relación. */
  subject?: WeekScheduleNestedSubject;

  /** Grupo de la asignación si el backend expande la relación. */
  group?: WeekScheduleNestedGroup;
}
