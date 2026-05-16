# AGENTS.md — Frontend Angular (TFG Ziryab)

> Guía rápida para cualquier agente de IA (Cursor, Copilot…) que trabaje en este
> repositorio. Para el detalle de cada convención, ver `.cursor/rules/`.

## Stack

- **Angular 19** (standalone components)
- **TypeScript** estricto
- **RxJS** + `BehaviorSubject` para estado reactivo (con migración gradual a signals)
- **Tailwind CSS** + SCSS puntual
- **ngx-translate** para i18n (es / en / de)
- **Firebase Auth** (`@angular/fire`) + JWT del backend propio
- **Jasmine + Karma** para tests
- **Compodoc** para documentación (`npm run docs`)

## Comandos habituales

| Comando | Para qué |
|---|---|
| `npm start` / `ng serve` | Servir en desarrollo |
| `npm run build` | Compilar |
| `npm test` | Tests con Karma |
| `npm run docs` | Generar docs Compodoc |

## Estructura del código

```
src/app/
├── core/                # Singletons compartidos
│   ├── configs/
│   ├── guards/          # AuthGuard, RoleGuard
│   ├── i18n/            # Traducciones
│   ├── interceptors/    # auth.interceptor.ts (añade JWT)
│   ├── models/          # Interfaces del dominio
│   └── services/        # providedIn: 'root'
│       ├── admin/ | alumno/ | profesor/ | UI/
├── pages/               # Vistas agrupadas por rol
│   ├── admin/
│   ├── alumno/
│   ├── profesor/
│   └── shared/          # login, header, footer, perfil, about
└── app.{component,config,routes}.ts
```

## Convenciones no negociables

1. **Standalone components** siempre. Nada de `NgModule`.
2. **Inyección con `inject()`** en componentes/servicios nuevos.
3. **Rutas protegidas** con `canActivate: [AuthGuard]` y, si hay rol,
   `RoleGuard` + `data: { roles: ['STUDENT' | 'TEACHER' | 'ADMIN'] }`.
4. **Servicios** con `@Injectable({ providedIn: 'root' })` y `environment.apiUrl`
   (nunca URLs hardcodeadas).
5. **HTTP** con tipado genérico `ApiResponse<T> = { message: string; data: T }`
   (ver `auth.service.ts`).
6. **Textos visibles** pasan siempre por `| translate` o `TranslateService`.
7. **Commits**: preferido `[CURSO-XX] descripción`; alternativo `tipo(CURSO-XX): …` (ver `.cursor/commit-format.conf`).
8. **TODOs**: `// TODO [CURSO-XX]: ...` con clave Jira entre corchetes.

## Roles

El dominio maneja tres roles: `'STUDENT' | 'TEACHER' | 'ADMIN'`.
Viven en `UserResponse.role` (ver `core/services/auth.service.ts`).

## Trabajo con Jira / Confluence

Hay un MCP de **Atlassian Rovo** activo. Úsalo para:

- Consultar el ticket antes de empezar (`getJiraIssue`).
- Transicionar a "In Progress" al empezar y "Done" + comentario al terminar.
- Crear bugs o stories (`createJiraIssue`) cuando detectes problemas en el código.
- Publicar documentación de componentes/servicios en Confluence.

Las skills están en `.cursor/skills/` (feature-generator, jira-manager, docs-confluence).

## Configuración Cursor

Todo lo específico del agente vive en `.cursor/`:

- `.cursor/rules/` — convenciones aplicadas por globs (components, services, routes…).
- `.cursor/skills/` — workflows reutilizables.
- `.cursor/hooks.json` + `.cursor/hooks/` — auto-lint, validación de commits,
  guard de comandos peligrosos, auditoría MCP.

Ver `.cursor/README.md` para el detalle.

## Cosas a evitar

- Hardcodear credenciales Firebase fuera de `app.config.ts` (y ojo: las actuales
  deberían migrarse a `environment`).
- Duplicar rutas en `app.routes.ts` (ya hay duplicados de `dashboard` y
  `ficha-usuario` pendientes de limpiar — avisar antes de tocarlos).
- Componentes de más de ~150 líneas: extraer a servicio o subcomponentes.
- Lógica compleja en templates: moverla al `.ts`.
