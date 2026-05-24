/** Resumen devuelto por GET /api/analytics/summary */
export interface AnalyticsSummary {
  /** Filtros que el backend aplicó para calcular KPIs y tablas. */
  filters: {
    /** Curso escolar consultado. */
    anyo: string;

    /** Ciclo formativo seleccionado o `todos`. */
    ciclo: string;

    /** Grupo seleccionado o `todos`. */
    grupo: string;

    /** Indica si el cálculo incluye matrículas inactivas. */
    incluirInactivos: boolean;
  };

  /** Métricas agregadas mostradas como tarjetas principales del informe. */
  kpis: Record<string, string | number | boolean | null>;

  /** Recuento de matrículas y alumnos únicos por ciclo, curso y estado. */
  alumnosCiclo: AnalyticsAlumnosCicloRow[];

  /** Ocupación y alumnado por grupo para detectar grupos con mayor carga. */
  alumnosGrupo: AnalyticsAlumnosGrupoRow[];

  /** Resumen de asignaciones docentes y horas impartidas por curso. */
  profesores: AnalyticsProfesoresRow[];

  /** Serie mensual de asistencia usada por las tablas/gráficas del informe. */
  asistenciaMensual: AnalyticsAsistenciaRow[];

  /** Resumen de tareas y entregas por curso y tipo de tarea. */
  tareas: AnalyticsTareasRow[];
}

/** Fila del informe de alumnado agregada por ciclo, nivel y estado de matrícula. */
export interface AnalyticsAlumnosCicloRow {
  /** Nombre del ciclo formativo. */
  course_name: string;

  /** Nivel/curso dentro del ciclo. */
  grade: string;

  /** Estado de matrícula incluido en el recuento. */
  enrollment_status: string;

  /** Número de matrículas encontradas para esa combinación. */
  matriculas: number;

  /** Número de alumnos distintos tras agrupar posibles matrículas múltiples. */
  alumnos_unicos: number;
}

/** Fila del informe de ocupación por grupo. */
export interface AnalyticsAlumnosGrupoRow {
  /** Nombre del ciclo formativo. */
  course_name: string;

  /** Nombre del grupo académico. */
  group_name: string;

  /** Matrículas registradas en el grupo. */
  matriculas: number;

  /** Alumnos únicos matriculados en el grupo. */
  alumnos_unicos: number;

  /** Capacidad máxima configurada para el grupo. */
  capacity: number;

  /** Porcentaje de ocupación del grupo; `null` si no hay capacidad válida. */
  ocupacion_pct: number | null;
}

/** Fila del informe de profesorado por curso y estado de asignación. */
export interface AnalyticsProfesoresRow {
  /** Nombre del ciclo formativo. */
  course_name: string;

  /** Estado de la asignación docente. */
  assignment_status: string;

  /** Número total de asignaciones docentes. */
  asignaciones: number;

  /** Profesores distintos implicados en esas asignaciones. */
  profesores_unicos: number;

  /** Suma de horas semanales declaradas en las asignaturas asignadas. */
  horas_totales: number;
}

/** Fila de asistencia mensual calculada para el informe. */
export interface AnalyticsAsistenciaRow {
  /** Mes agregado en formato devuelto por el backend. */
  mes: string;

  /** Nombre del ciclo formativo. */
  course_name: string;

  /** Número total de registros de asistencia. */
  registros: number;

  /** Registros marcados como presentes. */
  presentes: number;

  /** Registros marcados como ausentes. */
  ausentes: number;

  /** Porcentaje de asistencia del mes; `null` si no hay base de cálculo. */
  tasa_asistencia_pct: number | null;
}

/** Fila de seguimiento de tareas y entregas del informe. */
export interface AnalyticsTareasRow {
  /** Nombre del ciclo formativo. */
  course_name: string;

  /** Tipo de tarea agrupado por el backend. */
  task_type: string;

  /** Número de tareas creadas. */
  tareas: number;

  /** Número de entregas recibidas. */
  entregas: number;

  /** Entregas que ya tienen calificación. */
  calificadas: number;

  /** Entregas pendientes de corrección o recepción. */
  pendientes: number;

  /** Porcentaje de entrega; `null` si no hay tareas sobre las que calcular. */
  tasa_entrega_pct: number | null;
}

/** Respuesta del endpoint de resumen de analíticas. */
export interface AnalyticsSummaryResponse {
  /** Mensaje informativo del backend. */
  message: string;

  /** Resumen completo que alimenta el panel de informes. */
  data: AnalyticsSummary;
}

/** Parámetros compartidos por resumen y exportaciones de informes. */
export interface AnalyticsExportParams {
  /** Curso escolar del informe. */
  anyo: string;

  /** Ciclo formativo o `todos`. */
  ciclo: string;

  /** Grupo académico o `todos`. */
  grupo: string;

  /** Incluye registros inactivos cuando el backend lo permite. */
  inactivos: boolean;

  /** Formato del fichero exportado. */
  formato: 'csv' | 'xlsx';

  /** Si es `true`, exporta el dataset completo ignorando filtros de ciclo/grupo. */
  completo: boolean;
}
