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
  label: string;
  schoolYear: string;
  created: number;
  weekDays: number[];
  slotCount: number;
}

export interface WeekScheduleMaterializeResponse {
  success: boolean;
  data?: WeekScheduleMaterializeResult;
  message?: string;
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
  success: boolean;
  created?: number;
  skipped?: number;
  error?: string;
  message?: string;
}
