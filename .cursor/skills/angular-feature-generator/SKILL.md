---
name: angular-feature-generator
description: >-
  Genera la estructura completa de una pantalla/feature Angular (componente standalone,
  servicio, modelo y registro en app.routes.ts) siguiendo las convenciones del proyecto
  Ziryab. Úsala cuando el usuario pida "nueva pantalla", "crear feature", "scaffold",
  "nueva página de alumno/profesor/admin" o "generar componente con servicio".
---

# Skill — Generador de feature Angular

Automatiza la creación de una nueva pantalla completa respetando las rules del proyecto
(standalone, `inject()`, Tailwind + SCSS, guards por rol, i18n).

## Entrada

El usuario debe indicar (preguntar si falta alguno):

1. **Nombre** de la feature en kebab-case (ej. `gestion-productos`).
2. **Rol** al que pertenece: `alumno | profesor | admin | shared`.
3. **Ruta** URL deseada (ej. `productos`). Si no se indica, usar el nombre en kebab-case.
4. **Clave de Jira** asociada (ej. `CURSO-4`). Si no existe, ofrecer crearla con
   `createJiraIssue` vía el MCP de Rovo.

## Estructura generada

```
src/app/pages/{rol}/{nombre}/
├── {nombre}.component.ts         # standalone, inject(), JSDoc
├── {nombre}.component.html       # Tailwind + | translate
├── {nombre}.component.scss
└── {nombre}.component.spec.ts    # Jasmine/Karma
```

Si la feature necesita datos de backend, además:

```
src/app/core/services/{rol}/{nombre}.service.ts
src/app/core/models/{nombre}.model.ts
```

Ver `templates.md` para los contenidos base.

## Pasos del workflow

1. **Validar** que no exista ya la carpeta `pages/{rol}/{nombre}/` (evitar pisarla).
2. **Crear** los archivos desde los templates, sustituyendo placeholders:
   - `{nombre}` → kebab-case
   - `{Nombre}` → PascalCase (ej. `GestionProductos`)
   - `{selector}` → `app-{nombre}`
   - `{CURSO-XX}` → clave Jira recibida
3. **Registrar la ruta** en `src/app/app.routes.ts`:
   - Importar el componente al principio
   - Añadir la ruta en la sección correspondiente al rol
   - Incluir `canActivate: [AuthGuard, RoleGuard]` y `data: { roles: [...] }`
   - Para features pesadas, preferir `loadComponent` (lazy)
4. **Añadir claves i18n** en `src/assets/i18n/{es,en,de}.json` (al menos `es`).
5. **MCP Jira** — Si se pasó clave:
   - `transitionJiraIssue` a "In Progress" al empezar
   - Al terminar: `addCommentToJiraIssue` con ruta de los archivos creados
6. **MCP Confluence** (opcional) — Crear página con `createConfluencePage`
   en el espacio del curso con la descripción inicial de la feature.

## Ejemplo de uso

> "Crea la feature de gestión de productos para profesor, ruta `productos`, ticket CURSO-4"

Resultado:
- `src/app/pages/profesor/gestion-productos/gestion-productos.component.{ts,html,scss,spec.ts}`
- Ruta registrada en `app.routes.ts` con `RoleGuard` y `data.roles: ['TEACHER']`
- Comentario en CURSO-4 con el resumen
