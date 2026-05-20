# Patrón CRUD admin (CURSO-103) — entidad Task

Referencia para clonar nuevas entidades admin. **No es un framework**: copiar carpeta y adaptar nombres.

## Entidades implementadas (CURSO-102)

| Ticket | Entidad | Menú `openedMenu` |
|--------|---------|-------------------|
| CURSO-103/104 | Task | `tasks` |
| CURSO-105 | ClassSession | `classSessions` |
| CURSO-106 | StudentTask | `studentTasks` |
| CURSO-107 | Assistance | `assistances` |
| CURSO-108 | Notification | `notifications` |

## Archivos por entidad

| Pieza | Ubicación (Task) |
|--------|------------------|
| Servicio HTTP + signal | `core/services/admin/entities/task.service.ts` |
| Lista | `pages/admin/entities/task/task-list/` |
| Fila + edit/delete/detail | `task-list-item/` → `app-generic-list-item` |
| Alta | `task-create-form/` |
| Menú | `admin-menu` → `onClick('tasks')` |
| Panel | `desplegable-admin` → `@if openedMenu === 'tasks'` |

## Servicio

- `apiUrl = environment.apiUrl + '/tasks'`
- `tasks = signal<Task[]>([])`, `loadTasks()` en `ngOnInit` del list
- CRUD: GET all, GET by id, POST, PATCH `/:id`, DELETE `/:id`
- Tipo de update: payload con `id` (el modal genérico lo añade)

## List-item

- `ListItemConfig` + `ViewDetailConfig` en el `.ts` del `*-list-item`
- `getByIdFn`, `updateFn`, `deleteFn` apuntan al servicio admin
- Recarga de lista: `effect` en `*-list` escuchando `ModalDeleteService` / `ModalEditService`

## i18n

- `entities.task`, `adminMenu.tasks`, `lists.tasks.*` en `es.json`, `en.json`, `de.json`

## Clonar a otra entidad

1. Duplicar carpeta `task/` → `nombre/`
2. Crear `nombre.service.ts` en `core/services/admin/entities/`
3. Ajustar modelo, campos del formulario y `editFields`
4. Registrar clave en menú + desplegable + traducciones
