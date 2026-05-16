/**
 * @file Servicio HTTP de **asignaciones docente–asignatura–grupo** vía ruta de profesores (CURSO-59).
 *
 * ## Objetivo en Jira
 * Exponer de forma explícita y tipada `GET /api/teachers/:id/subjects` (assignments del profesor),
 * coherente con el resto de servicios `entities` y con `environment.apiUrl`.
 *
 * ## Relación con código existente
 * - Hoy parte de esta lectura puede vivir en `ClasesService` u otros; aquí se documentará
 *   la intención de **unificar** o delegar para que el flujo de horarios no dependa de rutas sueltas.
 *
 * ## Tipado
 * - Respuestas según `TeacherSubjectAssignmentRow` y respuestas API en
 *   `core/models/teacher/subjectforteacher.ts` (y modelos de flujo si se extienden).
 *
 * ## Criterios Jira
 * - Sin URLs hardcodeadas; errores alineados al proyecto; `providedIn: 'root'` cuando se implemente la clase `@Injectable`.
 *
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-59
 */

export {};
