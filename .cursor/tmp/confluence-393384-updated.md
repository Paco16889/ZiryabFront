## Descripción

Este espacio Confluence acompaña el **curso / trabajo con Cursor + Angular**: uso de **Cursor** sobre el repositorio, **trazabilidad en Jira** (proyecto **CURSO** — CursorDefinitivo — con commits `tipo(CURSO-XX): …` y TODOs `// TODO [CURSO-XX]:`), integración **MCP Atlassian** (tickets, búsquedas, esta wiki), **rules**, **skills** y **hooks** bajo `.cursor/`, más la guía del agente `AGENTS.md` en la raíz del repo.

Ese mismo repositorio (`loginEnAngular`) es el **frontend del TFG Ziryab**: aplicación **Angular 19** para gestión académica (roles admin, profesor y alumno), **Firebase Auth**, API REST en desarrollo (`http://localhost:3000/api`) y las funcionalidades de dominio que siguen a continuación (historias **CURSO-16+** en Jira).

## Seguimiento del proyecto

### Toolbox y entregables del curso (Jira [CURSO-1](https://franciscocobsan.atlassian.net/browse/CURSO-1) … [CURSO-15](https://franciscocobsan.atlassian.net/browse/CURSO-15))

Fase previa al trabajo de producto del TFG: configuración del entorno ágil con Cursor, Jira y Confluence.

| Clave | Resumen | Entregable / reflejo en repo |
| --- | --- | --- |
| [**CURSO-1**](https://franciscocobsan.atlassian.net/browse/CURSO-1) | Convenciones de arquitectura Angular en Cursor Rules | `.cursor/rules/angular-architecture.mdc` (standalone, `inject()`, estructura `core/` · `pages/`, i18n, etc.) |
| [**CURSO-2**](https://franciscocobsan.atlassian.net/browse/CURSO-2) | Rules específicas componentes y servicios | `.cursor/rules/angular-components.mdc`, `angular-services.mdc` |
| [**CURSO-3**](https://franciscocobsan.atlassian.net/browse/CURSO-3) | Trazabilidad Jira en commits y comentarios TODO/FIXME | `.cursor/rules/jira-integration.mdc` |
| [**CURSO-4**](https://franciscocobsan.atlassian.net/browse/CURSO-4) | Skill scaffold de features Angular | `.cursor/skills/angular-feature-generator/` |
| [**CURSO-5**](https://franciscocobsan.atlassian.net/browse/CURSO-5) | Skill gestión de tickets Jira desde Cursor | `.cursor/skills/jira-manager/` (+ `examples.md`) |
| [**CURSO-6**](https://franciscocobsan.atlassian.net/browse/CURSO-6) | Skill documentación Angular → Confluence | `.cursor/skills/angular-docs-confluence/` |
| [**CURSO-7**](https://franciscocobsan.atlassian.net/browse/CURSO-7) | Skill sincronización TODO–Jira | Workflow descrito en el ticket (crear/limpiar TODOs con etiqueta `todo-sync`; referenciado desde `jira-integration.mdc`) |
| [**CURSO-8**](https://franciscocobsan.atlassian.net/browse/CURSO-8) | Hook lint y formato tras edición del agente | `.cursor/hooks.json` → `lint-and-format.sh` |
| [**CURSO-9**](https://franciscocobsan.atlassian.net/browse/CURSO-9) | Hook protección comandos peligrosos | `guard-commands.sh` (p. ej. `rm -rf`, `git push --force`) |
| [**CURSO-10**](https://franciscocobsan.atlassian.net/browse/CURSO-10) | Hook auditoría operaciones MCP | `audit-mcp.sh` → log tipo `.cursor/hooks/mcp-audit.log` |
| [**CURSO-11**](https://franciscocobsan.atlassian.net/browse/CURSO-11) | Hook validación de mensaje de commit con clave Jira | `validate-commit.sh` (regex alineado con **CURSO-3**) |
| [**CURSO-12**](https://franciscocobsan.atlassian.net/browse/CURSO-12) | Flujo integrador: del bug al fix con trazabilidad completa | Ejercicio que enlaza tickets, código, Confluence, commit y auditoría MCP |
| [**CURSO-13**](https://franciscocobsan.atlassian.net/browse/CURSO-13) | Dashboard de sprint publicado en Confluence | Skill `sprint-dashboard` + informes en este espacio (p. ej. [Sprint Report 2026-05-15](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/688129)) |
| [**CURSO-14**](https://franciscocobsan.atlassian.net/browse/CURSO-14) | Code review Angular con creación automática de tickets | Skill `angular-code-review` + criterios en rule asociada |
| [**CURSO-15**](https://franciscocobsan.atlassian.net/browse/CURSO-15) | **Bug:** memory leak en `UserListComponent` por `subscribe()` sin cleanup | Corrección en código (evitar suscripción manual; estado vía servicio/`signal` según diseño); **documentación detallada:** [Fix: Memory leak UserListComponent (CURSO-15)](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/655361) |
| [**CURSO-69**](https://franciscocobsan.atlassian.net/browse/CURSO-69) | Formato de commits preferido `[CURSO-XX]` y `commit-format.conf` | `.cursor/commit-format.conf` (regex preferido y alternativo); `validate-commit.sh` (acepta `[CURSO-XX] …` y `tipo(CURSO-XX): …`); rule `jira-integration.mdc`; refs en `AGENTS.md` y `.cursor/README.md` |

### Backend API (Node / Express)

| Clave | Resumen | Documentación Confluence |
| --- | --- | --- |
| [**CURSO-61**](https://franciscocobsan.atlassian.net/browse/CURSO-61) | Separar **assignments** (`TeacherOnSubjectOnGroup`) de **enrollments** (`StudentOnSubjectOnGroup`); nuevo módulo `/api/assignments` y avisos de deprecación en enrollments | [**Módulo API: Assignments (CURSO-61)**](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1277953) |
| [**CURSO-70**](https://franciscocobsan.atlassian.net/browse/CURSO-70) | Endpoint `GET /api/horarios-semanales/classes` — selector de clases (agregación sin tabla nueva) para builder horarios admin | [**Endpoint Clases (CURSO-70)**](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1474577) |

### TFG Ziryab — qué hay hoy en el frontend (`loginEnAngular`)

| Área | Detalle |
| --- | --- |
| **Arquitectura** | 100 % **componentes standalone**, sin `NgModule`; inyección con `inject()` donde aplica; rutas con `AuthGuard` y `RoleGuard` (`data.roles`: STUDENT, TEACHER, ADMIN); servicios `@Injectable({ providedIn: 'root' })` y URLs desde `environment.apiUrl`. |
| **i18n** | **es / en / de** con ngx-translate; claves para listado admin de horarios, builder y mensajes de error/vacíos (`weekScheduleBuilder.*`, `entities.weekSchedule.*`, etc.). |
| **Admin — horarios semanales** | `WeekScheduleListComponent` en el desplegable admin; patrón **lista ↔ builder** al crear (cabecera volver/cancelar, sin POST al cancelar). |
| **Week-schedule-builder (modular)** | Orquestador `week-schedule-builder` con `week-schedule-builder-selects` (profesor → asignación → profesor de franja/colisiones) y `week-schedule-builder-slot-form` (día, hora inicio/fin). |
| **Servicios de datos** | `WeekScheduleAssignmentDataService`: asignaciones por profesor (`GET /teachers/:id/subjects`) y _peers_ filtrados por grupo y curso vía detalle de asignatura (`GET /subjects/:id`). `WeekScheduleBuilderSubmitService`: POST de creación delegando en `WeekScheduleService`. |
| **API horarios** | `WeekScheduleService`: `GET/POST` y `PATCH/DELETE` sobre `/horarios-semanales`, más rutas por estudiante y profesor; modelo `WeekScheduleCreateRequest` (`idTeacherAssignment`, `weekDay`, `startTime`, `finishTime`). |
| **Vistas de calendario** | `horario-alumno` y `horario-profesor`: consumen el servicio de horarios y agrupan franjas por día de la semana. |
| **HTTP / sesión** | Interceptor con `withCredentials: true` para cookies de sesión tras login (`POST /auth/login` con token Firebase). |
| **Tooling Cursor** | Además de la tabla **CURSO-1…15**, reglas y skills específicas del proyecto en `.cursor/`. |

### Referencias Jira (trazabilidad TFG y backlog)

Desde **CURSO-16** cada bloque agrupa tickets que comparten una **decisión de producto o arquitectura** tomada en Jira. Las columnas **Qué se hizo / por qué** recogen el acuerdo; **Repo / doc** indica rutas en `loginEnAngular` o página Confluence si existe.

#### Decisión 1 — Constructor horario admin: patrón lista ↔ builder (sin modal)

**Por qué:** El admin crea horarios desde el listado existente. Se copió el patrón de `student-enrollment` (toggle lista/builder, cabecera con volver) para no usar modales y para que **cancelar descarte todo sin POST** — evita horarios fantasma y mantiene consistencia UX en admin.

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-16**](https://franciscocobsan.atlassian.net/browse/CURSO-16) | Historia | Finalizada | 5 | Admin: constructor de horario semanal | Historia padre: orquestador `week-schedule-builder` integrado en listado | `pages/admin/entities/weekSchedule/week-schedule-builder/`, `week-schedule-list/` |
| [**CURSO-17**](https://franciscocobsan.atlassian.net/browse/CURSO-17) | Tarea | Finalizada | 5 | Spike endpoints/servicios reutilizables | Inventario API: asignaciones (`/teachers/:id/subjects`), profesores, horarios; base para selects del builder | `core/services/clases.service.ts`, `week-schedule.service.ts` |
| [**CURSO-18**](https://franciscocobsan.atlassian.net/browse/CURSO-18) | Tarea | Finalizada | 2 | Refactor `environment.apiUrl` | Eliminar URLs hardcodeadas en servicios de horarios/profesores | `week-schedule.service.ts`, servicios teachers/clases |
| [**CURSO-19**](https://franciscocobsan.atlassian.net/browse/CURSO-19) | Tarea | Finalizada | 3 | Scaffold `WeekScheduleBuilderComponent` | Componente standalone vacío con estructura modular | `week-schedule-builder/` |
| [**CURSO-20**](https://franciscocobsan.atlassian.net/browse/CURSO-20) | Tarea | Finalizada | 3 | Integrar listado con builder | Toggle crear/cerrar; eventos `scheduleSaved` | `week-schedule-list.component.ts` |
| [**CURSO-21**](https://franciscocobsan.atlassian.net/browse/CURSO-21) | Tarea | Finalizada | 2 | i18n horarios admin | Claves `entities.weekSchedule.*`, `lists.schedules.*` en es/en/de | `src/assets/i18n/{es,en,de}.json` |
| [**CURSO-22**](https://franciscocobsan.atlassian.net/browse/CURSO-22) | Tarea | Finalizada | 5 | UI builder: bloques, selects, POST | Flujo profesor → asignación → franja; primer guardado vía API | `week-schedule-builder-selects/`, `week-schedule-builder-slot-form/` |
| [**CURSO-23**](https://franciscocobsan.atlassian.net/browse/CURSO-23) | Historia | Finalizada | 2 | Datos y selects del builder | Carga asignaciones y profesores _peers_ para colisiones | `WeekScheduleAssignmentDataService` |
| [**CURSO-24**](https://franciscocobsan.atlassian.net/browse/CURSO-24) | Historia | Finalizada | 2 | Franja día/horas y validación | Formulario de slot con validadores reactivos | `week-schedule-builder-slot-form/` |
| [**CURSO-25**](https://franciscocobsan.atlassian.net/browse/CURSO-25) | Historia | Finalizada | 2 | POST y feedback al guardar | Delegación en `WeekScheduleBuilderSubmitService`; toast/estado tras éxito | `core/services/admin/week-schedule-builder-submit.service.ts` |

#### Decisión 2 — Replanteo UX: el **grupo** como eje (no el profesor)

**Por qué:** El flujo **CURSO-16/22** empezaba por «¿qué profesor?», pero el caso de uso real es «crear el horario de un **grupo que aún no lo tiene**». Se replanteó el orden de pasos: primero grupo elegible, luego asignaciones de ese grupo, manteniendo validación de colisiones de profesor.

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-26**](https://franciscocobsan.atlassian.net/browse/CURSO-26) | Historia | Finalizada | 13 | Replanteo builder: grupo sin horario primero | Historia padre del cambio de eje mental UX | `week-schedule-builder-selects/` (refactor grupo-first) |
| [**CURSO-27**](https://franciscocobsan.atlassian.net/browse/CURSO-27) | Tarea | Finalizada | 5 | Regla «grupo sin horario» + contrato API | Definir qué grupos aparecen (sin `WeekSchedule` existente); alinear front/back | Ticket + acuerdo con backend |
| [**CURSO-28**](https://franciscocobsan.atlassian.net/browse/CURSO-28) | Tarea | Finalizada | 3 | UX orden de pasos y vacíos | Mensajes i18n cuando no hay grupos/asignaciones | `weekScheduleBuilder.*` en i18n |
| [**CURSO-29**](https://franciscocobsan.atlassian.net/browse/CURSO-29) | Tarea | Finalizada | 5 | Servicios: grupos elegibles y asignaciones | `fetchGroupScheduleContext` y filtros por grupo/curso | `week-schedule-assignment-data.service.ts` |
| [**CURSO-30**](https://franciscocobsan.atlassian.net/browse/CURSO-30) | Tarea | Finalizada | 8 | Refactor UI grupo primero | Reordenar selects; quitar profesor como primer paso | `week-schedule-builder-selects/` |
| [**CURSO-31**](https://franciscocobsan.atlassian.net/browse/CURSO-31) | Tarea | Finalizada | 2 | i18n flujo grupo-first | Nuevas claves es/en/de del flujo | `src/assets/i18n/` |
| [**CURSO-32**](https://franciscocobsan.atlassian.net/browse/CURSO-32) | Tarea | Finalizada | 2 | QA manual y regresión | Checklist listado + builder tras replanteo | Comentario cierre en Jira |

#### Decisión 3 — Épica horarios v2: **rejilla L–V** y **Assignment** como eje

**Por qué:** Tras el flujo franja a franja, se necesitaba una vista semanal visual: admin elige **grupo**, ve **assignments** del curso en paleta y los coloca en celdas L–V alineadas con `environment.timetableSlots`. Cada celda = un `WeekSchedule` (`idTeacherAssignment`, día, horas).

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-33**](https://franciscocobsan.atlassian.net/browse/CURSO-33) | Epic | Finalizada | — | Horarios v2: rejilla por grupo | Épica contenedora cerrada; historias **CURSO-34–39** y subtareas **CURSO-40–54** finalizadas (rejilla L–V entregada) | [Doc Confluence](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/622615) |
| [**CURSO-34**](https://franciscocobsan.atlassian.net/browse/CURSO-34) | Historia | Finalizada | 5 | Spike: contrato API, schoolYear, franjas | Inventario endpoints y estrategia de guardado | Subtareas CURSO-40, 41 |
| [**CURSO-35**](https://franciscocobsan.atlassian.net/browse/CURSO-35) | Historia | Finalizada | 8 | Capa datos: assignments + horarios del grupo | Servicio de contexto de grupo para la rejilla | Subtareas CURSO-42–44; `week-schedule-assignment-data.service.ts` |
| [**CURSO-36**](https://franciscocobsan.atlassian.net/browse/CURSO-36) | Historia | Finalizada | 13 | UI rejilla + DnD assignments | `WeekScheduleGridBuilderComponent`, paleta, drag-and-drop | [**Doc Confluence**](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/622615); `week-schedule-grid-builder/` |
| [**CURSO-37**](https://franciscocobsan.atlassian.net/browse/CURSO-37) | Historia | Finalizada | 8 | Persistencia desde rejilla | `persistDiff$`: POST/PATCH/DELETE según diff local | [Doc Confluence](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/622615) §CURSO-37 |
| [**CURSO-38**](https://franciscocobsan.atlassian.net/browse/CURSO-38) | Historia | Finalizada | 13 | Validaciones solapes y horas asignatura | Bloqueo _hard_ antes de guardar (grupo, profesor, `subject.hours`) | [Doc Confluence](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/622615) §CURSO-38 |
| [**CURSO-39**](https://franciscocobsan.atlassian.net/browse/CURSO-39) | Historia | Finalizada | 5 | i18n + QA builder v2 | Claves `weekScheduleBuilder.grid.*`, `mode*` | [Doc Confluence](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/622615) §CURSO-39 |

**Subtareas de implementación (épica CURSO-33)** — desglose cerrado en Jira:

| Clave | Padre | Estado | Resumen |
| --- | --- | --- | --- |
| [**CURSO-40**](https://franciscocobsan.atlassian.net/browse/CURSO-40) | CURSO-34 | Finalizada | Inventario endpoints y payloads |
| [**CURSO-41**](https://franciscocobsan.atlassian.net/browse/CURSO-41) | CURSO-34 | Finalizada | Franjas del centro + estrategia guardado |
| [**CURSO-42**](https://franciscocobsan.atlassian.net/browse/CURSO-42) | CURSO-35 | Finalizada | Servicio assignments por grupo + schoolYear |
| [**CURSO-43**](https://franciscocobsan.atlassian.net/browse/CURSO-43) | CURSO-35 | Finalizada | Carga WeekSchedules existentes del grupo |
| [**CURSO-44**](https://franciscocobsan.atlassian.net/browse/CURSO-44) | CURSO-35 | Finalizada | Modelos y tests mínimos |
| [**CURSO-45**](https://franciscocobsan.atlassian.net/browse/CURSO-45) | CURSO-36 | Finalizada | Layout rejilla y slots del centro |
| [**CURSO-46**](https://franciscocobsan.atlassian.net/browse/CURSO-46) | CURSO-36 | Finalizada | Paleta de assignments del grupo |
| [**CURSO-47**](https://franciscocobsan.atlassian.net/browse/CURSO-47) | CURSO-37 | Finalizada | UX guardado y reconciliación |
| [**CURSO-48**](https://franciscocobsan.atlassian.net/browse/CURSO-48) | CURSO-37 | Finalizada | Integración API WeekSchedule |
| [**CURSO-49**](https://franciscocobsan.atlassian.net/browse/CURSO-49) | CURSO-36 | Finalizada | DnD / interacción alternativa + estados |
| [**CURSO-50**](https://franciscocobsan.atlassian.net/browse/CURSO-50) | CURSO-38 | Finalizada | Validación solape de grupo |
| [**CURSO-51**](https://franciscocobsan.atlassian.net/browse/CURSO-51) | CURSO-38 | Finalizada | Validación solape profesor entre grupos |
| [**CURSO-52**](https://franciscocobsan.atlassian.net/browse/CURSO-52) | CURSO-38 | Finalizada | Indicadores Subject.hours en rejilla |
| [**CURSO-53**](https://franciscocobsan.atlassian.net/browse/CURSO-53) | CURSO-39 | Finalizada | i18n completo builder v2 |
| [**CURSO-54**](https://franciscocobsan.atlassian.net/browse/CURSO-54) | CURSO-39 | Finalizada | QA manual y notas de prueba |

#### Decisión 4 — Componentes modulares reutilizables (builder v3 interno)

**Por qué:** Extraer piezas del builder (picker de assignment, tarjetas por día/hora, modelos y capa HTTP) para reutilizarlas fuera de la rejilla y preparar tests. Historia **cerrada** en sprint actual; no sustituye la rejilla de **CURSO-33** sino que la complementa.

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-55**](https://franciscocobsan.atlassian.net/browse/CURSO-55) | Historia | Finalizada | 5 | Componentes y flujo interno horarios | Historia cerrada en sprint: picker, tarjetas día/hora, modelos y servicios HTTP; rejilla con selector `/classes` (CURSO-70); tareas **CURSO-56–60** finalizadas | `pages/admin/entities/weekSchedule/` |
| [**CURSO-56**](https://franciscocobsan.atlassian.net/browse/CURSO-56) | Tarea | Finalizada | 2 | Selector profesor/assignment reutilizable | Input/output tipado; emite fila de asignación | `week-schedule-assignment-picker/` |
| [**CURSO-57**](https://franciscocobsan.atlassian.net/browse/CURSO-57) | Tarea | Finalizada | 3 | Vista semanal: tarjetas por día | Contenedor día + tarjetas de franja | `week-schedule-day-card/`, `week-schedule-hour-card/` |
| [**CURSO-58**](https://franciscocobsan.atlassian.net/browse/CURSO-58) | Tarea | Finalizada | 1 | Modelos TypeScript flujo horarios | Interfaces en `week-schedule-flow/` | `core/models/week-schedule-flow/` |
| [**CURSO-59**](https://franciscocobsan.atlassian.net/browse/CURSO-59) | Tarea | Finalizada | 2 | Servicios HTTP enrollments + horarios | `AssignmentHttpService`, `EnrollmentHttpService` (`by-filters`); CRUD en `WeekScheduleService`. Consumo en rejilla → **CURSO-65** | `services-for-week-schedule/` |
| [**CURSO-60**](https://franciscocobsan.atlassian.net/browse/CURSO-60) | Tarea | Finalizada | 2 | Tests Jasmine builder | QA manual rejilla + selector de clases (`GET /horarios-semanales/classes`); seed corregido; criterios de tests cumplidos para el alcance del sprint | `week-schedule-grid-builder/`, `services-for-week-schedule/week-schedule-classes-http.service.ts` |

#### Decisión 5 — Backend: separar **assignments** de **enrollments**

**Por qué:** `GET /api/enrollments` devolvía `TeacherOnSubjectOnGroup` (profesores) mezclado con el concepto de matrícula de alumnos. Se creó `/api/assignments` y se deprecaron los GET de enrollments que eran en realidad assignments; `by-filters` sigue siendo solo alumnos.

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-61**](https://franciscocobsan.atlassian.net/browse/CURSO-61) | Error | Finalizada | 5 | Módulo `/api/assignments` + deprecación enrollments | Nuevo módulo backend; avisos de migración en endpoints viejos | [**Doc Confluence**](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1277953) (también en tabla Backend arriba) |
| [**CURSO-70**](https://franciscocobsan.atlassian.net/browse/CURSO-70) | Tarea | Finalizada | 3 | Endpoint `GET /api/horarios-semanales/classes` — selector clases | Agregación sin tabla; para builder clases | [**Doc Confluence**](https://franciscocobsan.atlassian.net/wiki/spaces/CCA/pages/1474577) (también en tabla Backend arriba) |

#### Decisión 6 — Frontend: migrar lecturas a `/api/assignments` (post CURSO-61)

**Por qué:** El front aún usa `/teachers/:id/subjects` y métodos deprecados de enrollments para assignments. Plan en sprint futuro: `AssignmentHttpService`, limpiar `EnrollmentHttpService`, migrar `ClasesService` y centralizar `by-filters` para alumnos.

| Clave | Tipo | Estado | SP | Resumen | Qué se hizo / por qué | Repo / doc |
| --- | --- | --- | --- | --- | --- | --- |
| [**CURSO-62**](https://franciscocobsan.atlassian.net/browse/CURSO-62) | Historia | Por hacer | 5 | Migración front a GET /api/assignments | Historia padre; ejecutar tras cerrar CURSO-55/59 | — |
| [**CURSO-63**](https://franciscocobsan.atlassian.net/browse/CURSO-63) | Tarea | Por hacer | 2 | `AssignmentHttpService` | `getAll()`, `getByTeacher(id, schoolYear)` | `teacher-assignment-http.service.ts` (esqueleto) |
| [**CURSO-64**](https://franciscocobsan.atlassian.net/browse/CURSO-64) | Tarea | Por hacer | 1 | Limpiar `EnrollmentHttpService` | Quitar `getAll`/`getByTeacher` deprecados | `enrollment-http.service.ts` |
| [**CURSO-65**](https://franciscocobsan.atlassian.net/browse/CURSO-65) | Tarea | Por hacer | 3 | Migrar ClasesService + assignment data | Sustituir `/teachers/:id/subjects` | `clases.service.ts`, `week-schedule-assignment-data.service.ts` |
| [**CURSO-66**](https://franciscocobsan.atlassian.net/browse/CURSO-66) | Tarea | Por hacer | 1 | QA clases-profesor | Verificar tarjetas «Mis clases» | `pages/profesor/clases-profesor/` |
| [**CURSO-67**](https://franciscocobsan.atlassian.net/browse/CURSO-67) | Tarea | Por hacer | 2 | Centralizar `by-filters` alumnos | Unificar matrículas en `EnrollmentHttpService` | `carga-studentspor-grupo-asignatura.service.ts`, `create-student-task.service.ts` |
| [**CURSO-68**](https://franciscocobsan.atlassian.net/browse/CURSO-68) | Tarea | Por hacer | 1 | Validación Bruno | Colección assignments vs by-filters | Bruno / Postman del equipo |
