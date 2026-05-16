/**
 * @file Servicio HTTP de **matrículas (enrollments)** para el flujo de horarios (CURSO-59).
 *
 * ## Objetivo en Jira
 * Centralizar llamadas a `/api/enrollments` con `HttpClient`, `environment.apiUrl` y el mismo
 * patrón de manejo de errores / `Observable` que el resto de servicios admin.
 *
 * ## Endpoints previstos
 * - `GET /api/enrollments` — listado (filtros y query params según contrato del backend).
 * - `GET /api/enrollments/teacher/:idTeacher` — matrículas asociadas a un profesor.
 *
 * ## Tipado
 * - Respuestas alineadas con `core/models/enrollment.ts` y, donde aplique al flujo de horarios,
 *   con `core/models/week-schedule-flow/week-schedule-enrollment-context.model.ts`.
 *
 * ## Refactor pendiente (fuera del solo esqueleto)
 * - Sustituir URLs hardcodeadas en servicios que hoy apuntan a `.../api/enrollments` (p. ej.
 *   flujos de profesor) para usar este servicio y una única base URL.
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-59
 */

export {};
