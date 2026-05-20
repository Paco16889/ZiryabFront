/**
 * @file Cobertura HTTP de **horarios semanales** (`/api/horarios-semanales`) ampliada en CURSO-59.
 *
 * ## Objetivo en Jira
 * Completar o alinear el cliente HTTP con el contrato del backend: colección, CRUD y **variantes**
 * mencionadas en el ticket (por profesor, assignment, estudiante, día), además de lo ya cubierto
 * por {@link WeekScheduleService} (esta carpeta).
 *
 * ## Estado actual (referencia)
 * - `WeekScheduleService` ya implementa parte de las rutas (listado global, por estudiante, por
 *   profesor, por id, crear, actualizar, borrar) con normalización de `weekDay`.
 *
 * ## Trabajo documentado aquí
 * - Añadir o mover métodos que falten respecto al backend (p. ej. por `assignment`, por `weekDay`
 *   como query, u otras rutas que exponga la API).
 * - Tipar las respuestas “crudas” con `core/models/week-schedule-flow/week-schedule.interfaces.ts`
 *   (`WeekScheduleApi`, `WeekSchedulesAllApiResponse`, …) **antes** de normalizar a
 *   `core/models/week-schedule.ts` si se separa capa wire / dominio.
 * - Mantener `environment.apiUrl` y política de errores homogénea.
 *
 * ## Nota
 * Listado de clases para el selector: {@link WeekScheduleClassesHttpService} (CURSO-70).
 * CRUD de franjas y orquestación del builder: {@link WeekScheduleService},
 * {@link WeekScheduleAssignmentDataService} (esta carpeta).
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-59
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-70
 */

export {};
