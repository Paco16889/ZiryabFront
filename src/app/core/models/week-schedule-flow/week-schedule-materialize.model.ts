/**
 * Contrato de materialización de horario semanal por clase (builder admin «Crear plantilla»).
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-146
 */

/** Franja horaria de la plantilla en formato `HH:mm` (hora y minutos con dos dígitos). */
export interface WeekScheduleMaterializeSlot {
  /** Inicio de la franja que se repetirá en cada día seleccionado. */
  startTime: string;

  /** Fin de la franja que se repetirá en cada día seleccionado. */
  finishTime: string;
}

/**
 * Cuerpo previsto para `POST` de materialización.
 * Se construye en `WeekScheduleCreateTemplateComponent.buildMaterializeRequest()`.
 */
export interface WeekScheduleMaterializeRequest {
  /** Etiqueta de la clase seleccionada (`WeekScheduleClassItem.label`). */
  label: string;
  /** Año escolar del listado de clases (p. ej. `2024-2025`). */
  schoolYear: string;
  /** Días laborables activos (`weekDay` 1–5, lunes–viernes). */
  weekDays: number[];
  /** Franjas horarias del centro para esa plantilla. */
  slots: WeekScheduleMaterializeSlot[];
}

/** Datos devueltos por `POST /api/horarios-semanales/materialize` (201). */
export interface WeekScheduleMaterializeResult {
  /** Etiqueta de la plantilla materializada. */
  label: string;

  /** Año escolar de la plantilla. */
  schoolYear: string;

  /** Número de registros de horario creados. */
  created: number;

  /** Días de la semana incluidos en la plantilla (`weekDay` 1–5). */
  weekDays: number[];

  /** Cantidad de franjas horarias definidas. */
  slotCount: number;
}

/** Envoltorio HTTP de la materialización de plantilla semanal. */
export interface WeekScheduleMaterializeResponse {
  /** Indica éxito de la operación HTTP. */
  success: boolean;

  /** Resultado de la materialización cuando la petición tiene éxito. */
  data?: WeekScheduleMaterializeResult;

  /** Mensaje informativo del backend. */
  message?: string;

  /** Código o texto de error cuando `success` es falso. */
  error?: string;
}

/** Cuerpo de `POST /api/sessions/bulk-generate`. */
export interface WeekScheduleBulkGenerateRequest {
  /** Etiqueta de la clase (`WeekScheduleClassItem.label`). */
  label: string;
  /** Año escolar, p. ej. `2024-2025`. */
  schoolYear: string;
}

/** Respuesta de `POST /api/sessions/bulk-generate`. */
export interface WeekScheduleBulkGenerateResponse {
  /** Indica éxito de la operación HTTP. */
  success: boolean;

  /** Sesiones de clase generadas a partir del horario semanal. */
  created?: number;

  /** Sesiones omitidas (p. ej. ya existían). */
  skipped?: number;

  /** Código o texto de error cuando `success` es falso. */
  error?: string;

  /** Mensaje informativo del backend. */
  message?: string;
}
