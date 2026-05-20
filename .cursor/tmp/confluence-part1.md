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
