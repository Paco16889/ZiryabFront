/**
 * Contrato de materialización de horario semanal por clase (builder admin «Crear plantilla»).
 * El POST en backend está pendiente (CURSO-71).
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-92
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
