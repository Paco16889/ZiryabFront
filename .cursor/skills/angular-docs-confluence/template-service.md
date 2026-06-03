# Servicio: {Nombre}

> Generado automáticamente desde `src/app/core/services/{ruta}/{nombre}.service.ts`.

## Descripción

{descripción funcional a partir del JSDoc}

## Provisión

`@Injectable({ providedIn: 'root' })` — singleton global.

## Estado expuesto

- `{propiedad$}: Observable<{Tipo}>` — {para qué sirve}
- `{signal}: Signal<{Tipo}>` — {si aplica}

## Métodos públicos

| Método | Parámetros | Retorno | Descripción |
|--------|------------|---------|-------------|
|        |            |         |             |

## Endpoints consumidos

| Método HTTP | URL | Descripción |
|-------------|-----|-------------|
|             |     |             |

Base URL: `environment.apiUrl`.

## Dependencias inyectadas

- `HttpClient` — peticiones al backend
- `{OtroServicio}` — {para qué}

## Ejemplo de uso

```typescript
private servicio = inject({Nombre}Service);

this.servicio.metodo().subscribe({
  next: (res) => { ... },
  error: (err) => { ... },
});
```

## Ticket Jira asociado

[{CURSO-XX}](https://{workspace}.atlassian.net/browse/{CURSO-XX})
