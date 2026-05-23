/** Resumen devuelto por GET /api/analytics/summary */
export interface AnalyticsSummary {
  filters: {
    anyo: string;
    ciclo: string;
    grupo: string;
    incluirInactivos: boolean;
  };
  kpis: Record<string, string | number | boolean | null>;
  alumnosCiclo: AnalyticsAlumnosCicloRow[];
  alumnosGrupo: AnalyticsAlumnosGrupoRow[];
  profesores: AnalyticsProfesoresRow[];
  asistenciaMensual: AnalyticsAsistenciaRow[];
  tareas: AnalyticsTareasRow[];
}

export interface AnalyticsAlumnosCicloRow {
  course_name: string;
  grade: string;
  enrollment_status: string;
  matriculas: number;
  alumnos_unicos: number;
}

export interface AnalyticsAlumnosGrupoRow {
  course_name: string;
  group_name: string;
  matriculas: number;
  alumnos_unicos: number;
  capacity: number;
  ocupacion_pct: number | null;
}

export interface AnalyticsProfesoresRow {
  course_name: string;
  assignment_status: string;
  asignaciones: number;
  profesores_unicos: number;
  horas_totales: number;
}

export interface AnalyticsAsistenciaRow {
  mes: string;
  course_name: string;
  registros: number;
  presentes: number;
  ausentes: number;
  tasa_asistencia_pct: number | null;
}

export interface AnalyticsTareasRow {
  course_name: string;
  task_type: string;
  tareas: number;
  entregas: number;
  calificadas: number;
  pendientes: number;
  tasa_entrega_pct: number | null;
}

export interface AnalyticsSummaryResponse {
  message: string;
  data: AnalyticsSummary;
}

export interface AnalyticsExportParams {
  anyo: string;
  ciclo: string;
  grupo: string;
  inactivos: boolean;
  formato: 'csv' | 'xlsx';
  completo: boolean;
}
