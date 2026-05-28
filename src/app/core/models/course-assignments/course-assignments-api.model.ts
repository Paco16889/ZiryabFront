import { AssignmentWithIncludes } from '../assingment';

/** Respuesta con grades distintos de `Subject.grade` en un ciclo (p. ej. `"1"`, `"2"`). */
export type CourseGradesResponse = {
  success: boolean;
  data: string[];
  count?: number;
};

/** Asignatura ofertada para un ciclo y grade dentro del flujo de asignaciones docentes. */
export type CourseSubjectOfferItem = {
  /** Identificador de la asignatura ofertada. */
  id: number;

  /** Nombre de la asignatura. */
  name: string;

  /** Nivel/curso dentro del ciclo. */
  grade: string;

  /** Horas semanales declaradas. */
  hours?: number;

  /** Descripción académica opcional. */
  description?: string;

  /** Ciclo al que pertenece la asignatura. */
  idCourse: number;
};

/** Respuesta con asignaturas de un ciclo filtradas por grade. */
export type CourseSubjectsByGradeResponse = {
  success: boolean;
  data: CourseSubjectOfferItem[];
  count?: number;
};

/** Respuesta con asignaciones existentes para una oferta de ciclo, grade y curso escolar. */
export type CourseAssignmentsByOfferResponse = {
  success: boolean;
  data: AssignmentWithIncludes[];
  count?: number;
};

/** Ítem para alta de asignación docente (bulk o unitario). */
export interface AssignmentBulkCreateItem {
  /** Profesor que se asignará a la asignatura. */
  idTeacher: number;

  /** Asignatura que recibirá asignación docente. */
  idSubject: number;

  /** Grupo donde se impartirá la asignatura. */
  idGroup: number;

  /** Curso escolar de la asignación. */
  schoolYear: string;
}

/** Resultado agregado de crear asignaciones docentes en lote. */
export type AssignmentBulkCreateResult = {
  /** Número de asignaciones creadas. */
  created: number;

  /** Número de filas ignoradas por existir ya la asignación. */
  duplicates: number;

  /** Número de filas omitidas por validación del backend. */
  skipped: number;

  /** Errores por asignatura al ejecutar el alta masiva. */
  errors: Array<{ idSubject: number; message: string }>;
};

/** Respuesta del endpoint bulk de asignaciones docentes. */
export type AssignmentBulkCreateResponse = {
  success: boolean;
  data?: AssignmentBulkCreateResult;
  message?: string;
};

/** Cuerpo y respuesta de `POST /api/assignments/bulk` (contrato back CURSO-101). */
export type AssignmentBulkApiBody = {
  assignments: AssignmentBulkCreateItem[];
};

/** Respuesta cruda de `POST /api/assignments/bulk` tal como la devuelve el backend. */
export type AssignmentBulkApiResponse = {
  /** Indica si la petición se procesó correctamente. */
  success: boolean;

  /** Mensaje informativo o de error del servidor. */
  message?: string;

  /** Desglose del resultado del alta masiva. */
  data?: {
    /** Asignaciones creadas en la operación. */
    created: unknown[];

    /** Filas descartadas por duplicado. */
    duplicates: unknown[];

    /** Errores por índice de entrada en el array enviado. */
    errors: Array<{
      /** Posición del ítem fallido en `assignments`. */
      index: number;

      /** Descripción del error devuelto por el backend. */
      message: string;

      /** Datos de entrada asociados al error (p. ej. asignatura conflictiva). */
      input?: { idSubject: number };
    }>;
  };
};
