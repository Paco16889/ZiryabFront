---
name: angular-docs-confluence
description: >-
  Analiza un componente o servicio Angular del proyecto Ziryab y publica (o actualiza)
  su documentación en Confluence usando el MCP de Atlassian Rovo. Úsala cuando el
  usuario pida "documentar <nombre>", "publicar en Confluence", "generar doc del
  componente" o "actualizar la documentación de <servicio>".
---

# Skill — Documentación Angular en Confluence

Convierte el código de un componente o servicio en una página Confluence con
formato estándar. Si la página ya existe, la actualiza en vez de duplicar.

## Herramientas MCP

- `searchConfluenceUsingCql` — comprobar si existe la página
- `createConfluencePage` — publicar una nueva
- `updateConfluencePage` — actualizar la existente

## Parámetros necesarios

Preguntar al usuario si faltan:

- **Nombre/ruta** del componente o servicio a documentar.
- **Espacio de Confluence** (por defecto: `Curso Cursor + Angular`).
- **Clave de Jira asociada** (ej. `CURSO-6`) — la enlazaremos en la página.

## Workflow

1. **Identificar el tipo** leyendo el fichero:
   - `*.component.ts` → usar `template-component.md`
   - `*.service.ts` → usar `template-service.md`

2. **Analizar** el código y extraer:
   - **Componentes**: selector, inputs/outputs, servicios inyectados,
     rutas donde se usa (grep sobre `app.routes.ts`), resumen del template.
   - **Servicios**: `providedIn`, métodos públicos con firma y JSDoc,
     endpoints HTTP que consume, dependencias inyectadas.

3. **Buscar página existente** con `searchConfluenceUsingCql`:

   ```
   type = page AND space = "{ESPACIO}" AND title = "Componente: {Nombre}"
   ```

   o

   ```
   type = page AND space = "{ESPACIO}" AND title = "Servicio: {Nombre}"
   ```

4. **Rellenar la plantilla** correspondiente (ver ficheros `template-*.md`).

5. **Publicar**:
   - Si existe → `updateConfluencePage({ pageId, title, body, contentFormat: "markdown" })`.
   - Si no existe → `createConfluencePage({ spaceKey, title, body, contentFormat: "markdown" })`.

6. **Añadir link** de la página al ticket Jira (`addCommentToJiraIssue`) si se pasó clave.

## Ejemplo de uso

> "Documenta AuthService en Confluence, ticket CURSO-6"

Resultado: página "Servicio: AuthService" en el espacio del curso, con los
métodos `login`, `register`, `verifySession`, `logout`, `getCurrentUser`…
detectados automáticamente en `core/services/auth.service.ts`, más los
endpoints HTTP (`POST /auth/login`, `POST /auth/register`, …) y la sección
"Ticket Jira asociado: [CURSO-6]".
