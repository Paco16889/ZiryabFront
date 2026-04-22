# Configuración Cursor — Proyecto Angular (Ziryab)

Este directorio contiene la configuración personalizada de Cursor para el
proyecto frontend Angular 19 del TFG.

## Estructura

```
.cursor/
├── rules/          # Convenciones que el agente aplica automáticamente
│   ├── angular-architecture.mdc     (alwaysApply)
│   ├── angular-components.mdc       (globs: **/*.component.ts)
│   ├── angular-services.mdc         (globs: **/*.service.ts)
│   ├── angular-routing.mdc          (globs: **/*.routes.ts)
│   └── jira-integration.mdc         (alwaysApply)
│
├── skills/         # Workflows invocables por nombre o lenguaje natural
│   ├── angular-feature-generator/   # Crea componente + servicio + ruta
│   ├── jira-manager/                # CRUD de tickets Jira vía MCP
│   └── angular-docs-confluence/     # Publica docs en Confluence
│
├── hooks.json      # Registro de hooks
└── hooks/          # Scripts bash
    ├── lint-and-format.sh   (afterFileEdit)
    ├── guard-commands.sh    (beforeShellExecution)
    ├── validate-commit.sh   (beforeShellExecution — git commit)
    ├── audit-mcp.sh         (afterMCPExecution)
    └── mcp-audit.log        (generado en runtime, ignorado por git)
```

## MCP requerido

La mayoría de las skills dependen del MCP **Atlassian Rovo** para interactuar
con Jira y Confluence. Instálalo desde `Cursor Settings > MCP` y autentícate
con tu cuenta Atlassian.

## Convención Jira

Todos los commits deben seguir `tipo(CURSO-XX): descripción` (ver
`rules/jira-integration.mdc`). El hook `validate-commit.sh` bloquea los que
no cumplan el formato.
