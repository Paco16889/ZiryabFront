# Hooks de Cursor — Proyecto Angular

Los hooks están registrados en `.cursor/hooks.json` y se disparan en estos eventos:

| Evento | Script | Propósito |
|---|---|---|
| `afterFileEdit` | `lint-and-format.sh` | Formatea con Prettier/ESLint cada fichero que edita el agente. |
| `beforeShellExecution` | `guard-commands.sh` | Pide confirmación en comandos peligrosos (`rm -rf`, `git push --force`, `ng build --configuration production`, `npm publish`). |
| `beforeShellExecution` | `validate-commit.sh` | Bloquea commits que no cumplan `tipo(CURSO-XX): …`. |
| `afterMCPExecution` | `audit-mcp.sh` | Guarda cada llamada MCP en `mcp-audit.log`. |

## Ejecutar en Windows

Cursor ejecuta los hooks con `bash`, por lo que en Windows necesitas tener
**Git Bash** disponible (viene con Git for Windows). No hace falta instalar nada
más. Si no lo tienes, también puedes instalar WSL.

Para marcar los scripts como ejecutables dentro de Git Bash:

```bash
chmod +x .cursor/hooks/*.sh
```

En Windows puro, Git ya los trata como ejecutables si tienen `shebang` (`#!/usr/bin/env bash`).

## Fail open / fail closed

- `lint-and-format.sh` es **fail open**: si falta Prettier/ESLint, no rompe el edit.
- `guard-commands.sh` y `validate-commit.sh` usan `failClosed: true` en el JSON,
  por lo que si el script falla, el comando NO se ejecuta (más seguro).

## Log de auditoría MCP

`.cursor/hooks/mcp-audit.log` (se ignora por git) crece con cada llamada MCP.
Úsalo para revisar qué herramientas ha invocado el agente en la sesión.

Formato:

```
[2026-04-22 10:30:15] createJiraIssue - {"arguments":{"projectKey":"CURSO",...}}
[2026-04-22 10:31:02] searchJiraIssuesUsingJql - {"arguments":{"jql":"sprint in openSprints()"}}
```
