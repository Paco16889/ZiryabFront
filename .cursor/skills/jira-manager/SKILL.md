---
name: jira-manager
description: >-
  Gestiona tickets de Jira del proyecto CURSO desde Cursor sin abrir el navegador:
  listar, buscar, crear, editar, transicionar y comentar issues usando el MCP de
  Atlassian Rovo. Úsala cuando el usuario mencione "ticket", "issue", "Jira",
  "backlog", "sprint", "bug", "story" o pida "pásalo a Done", "créame una tarea", etc.
---

# Skill — Gestor de Jira

Centraliza todas las operaciones de Jira en un único flujo dentro de Cursor
usando el MCP de **Atlassian Rovo**. Sirve tanto para el proyecto Angular como
para el backend Node (comparten el mismo proyecto `CURSO`).

## Herramientas MCP que se usan

| Acción | Herramienta MCP |
|---|---|
| Leer un ticket | `getJiraIssue` |
| Buscar tickets con JQL | `searchJiraIssuesUsingJql` |
| Crear ticket | `createJiraIssue` |
| Editar campos | `editJiraIssue` |
| Listar transiciones | `getTransitionsForJiraIssue` |
| Cambiar estado | `transitionJiraIssue` |
| Comentar | `addCommentToJiraIssue` |

## Workflows

### 1. Consultar un ticket

> "Muéstrame el ticket CURSO-5"

1. Llamar `getJiraIssue({ issueIdOrKey: "CURSO-5" })`.
2. Mostrar al usuario: clave, tipo, estado, asignado, resumen, descripción y etiquetas.

### 2. Buscar tickets

> "Dame mis tareas del sprint actual"

Construir la query JQL desde lenguaje natural (ver `examples.md`) y llamar
`searchJiraIssuesUsingJql({ jql, fields: ["summary","status","assignee","priority","labels"] })`.
Mostrar tabla resumen.

### 3. Crear ticket

> "Crea un bug: el formulario de login no valida emails vacíos"

Pedir si falta alguno:
- **Proyecto** (por defecto `CURSO`)
- **Tipo**: `Bug | Story | Task`
- **Resumen** (título corto)
- **Descripción** (en `contentFormat: "markdown"`)
- **Etiquetas** opcionales
- **Componente afectado** si se puede deducir (p. ej. `LoginComponent`, `auth.service`)

Llamar `createJiraIssue({ projectKey, issueTypeName, summary, description, contentFormat: "markdown", labels })`.

Devolver la clave creada (ej. `CURSO-25`) y el link para que el usuario lo abra.

### 4. Transicionar estado

> "Pasa CURSO-5 a Done"

1. `getTransitionsForJiraIssue({ issueIdOrKey: "CURSO-5" })` — para saber qué IDs existen.
2. Localizar la transición cuyo nombre coincide con el objetivo (`In Progress`, `Done`, `In Review`).
3. `transitionJiraIssue({ issueIdOrKey, transitionId })`.
4. Confirmar al usuario el estado nuevo.

### 5. Comentar

> "Añade un comentario a CURSO-4 indicando la ruta de los archivos creados"

`addCommentToJiraIssue({ issueIdOrKey, body, contentFormat: "markdown" })`.

## Plantilla de descripción para bugs

Cuando crees un Bug desde código, rellena siempre:

```markdown
## Resumen
{una frase}

## Pasos para reproducir
1. ...
2. ...

## Comportamiento esperado
...

## Comportamiento actual
...

## Archivo / Componente afectado
- `src/app/pages/.../login.component.ts` (línea XX)

## Stack o mensaje de error
```

## Buenas prácticas

- **Siempre** consulta las transiciones antes de transicionar (los IDs varían por flujo).
- **Siempre** usa `contentFormat: "markdown"` al escribir descripciones/comentarios largos.
- **Nunca** crees tickets duplicados: antes de crear, busca con `searchJiraIssuesUsingJql` por resumen similar.
- Al trabajar un ticket, transiciona a "In Progress" al empezar y a "Done" al terminar,
  añadiendo siempre un comentario resumen.
