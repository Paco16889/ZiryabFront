# Queries JQL útiles — proyecto CURSO

Usa estas queries con `searchJiraIssuesUsingJql`.

## Mi trabajo

```
assignee = currentUser() AND status != Done ORDER BY updated DESC
```

## Sprint activo

```
sprint in openSprints() AND project = CURSO
```

## Mis tareas del sprint

```
sprint in openSprints() AND project = CURSO AND assignee = currentUser()
```

## Bugs abiertos

```
project = CURSO AND issuetype = Bug AND status != Done
```

## Por etiqueta (del backlog del TFG)

```
project = CURSO AND labels = rules
project = CURSO AND labels = skills
project = CURSO AND labels = hooks
project = CURSO AND labels = jira
project = CURSO AND labels = confluence
project = CURSO AND labels = integrador
```

## Frontend vs backend

```
project = CURSO AND labels = frontend
project = CURSO AND labels = backend
```

## Creadas esta semana

```
project = CURSO AND created >= startOfWeek()
```

## Bloqueantes

```
project = CURSO AND priority = Highest AND status != Done
```

## TODOs sincronizados desde código

```
project = CURSO AND labels = todo-sync
```

## Resueltas por tipo

```
project = CURSO AND status = Done AND issuetype = Bug
project = CURSO AND status = Done AND issuetype = Story
```
