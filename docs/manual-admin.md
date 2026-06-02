# Manual de usuario — Panel de Administración · Ziryab

> Versión 1.0 · Curso 2025-2026

---

## Tabla de contenidos

1. [Acceso y login](#1-acceso-y-login)
2. [Panel de administración](#2-panel-de-administración)
3. [Alumnos](#3-alumnos)
4. [Profesores](#4-profesores)
5. [Ciclos formativos](#5-ciclos-formativos)
6. [Grupos](#6-grupos)
7. [Asignaturas](#7-asignaturas)
8. [Horarios semanales](#8-horarios-semanales)
9. [Sesiones de clase](#9-sesiones-de-clase)
10. [Tareas académicas](#10-tareas-académicas)
11. [Entregas de alumnos](#11-entregas-de-alumnos)
12. [Asistencias](#12-asistencias)
13. [Tablón de anuncios](#13-tablón-de-anuncios)
14. [Notificaciones](#14-notificaciones)
15. [Ajustes de interfaz](#15-ajustes-de-interfaz)

---

## 1. Acceso y login

Para entrar en la plataforma, accede a la URL del centro e introduce tu **email** y **contraseña** de administrador.

![Pantalla de login](./screenshots/login.png)

> **Redirección automática.** Si ya has iniciado sesión, la aplicación te llevará directamente al panel sin pedirte credenciales de nuevo.

El sistema gestiona tres roles:

| Rol | Acceso |
|-----|--------|
| **Admin** | Panel de administración completo |
| **Profesor** | Vista de clases, horario y gestión de sus alumnos |
| **Alumno** | Vista de tareas, horario y temario |

---

## 2. Panel de administración

Tras el login, el administrador accede al **panel central** donde se concentra toda la gestión del centro.

![Panel de administración](./screenshots/dashboard-admin.png)

La interfaz tiene dos zonas principales:

- **Menú lateral** (izquierda): acceso a cada sección con un solo clic. En dispositivos móviles se oculta y se abre con el botón hamburguesa.
- **Área principal** (derecha): muestra el contenido de la sección activa.

> **Tip.** Usa el botón **← Volver** o el icono `←` en la cabecera para navegar hacia atrás sin perder lo que estabas haciendo.

---

## 3. Alumnos

**Menú → Alumnos**

![Listado de alumnos](./screenshots/alumnos-lista.png)

El listado muestra todos los alumnos registrados en el sistema. Desde aquí puedes:

- **Ver detalle** de un alumno (icono ojo).
- **Editar** sus datos (icono lápiz).
- **Eliminar** al alumno del sistema (icono papelera), previa confirmación.

### Matricular un alumno

Pulsa **Matricular alumno** para iniciar el asistente de matriculación en tres pasos:

![Asistente de matriculación](./screenshots/alumnos-matriculacion.png)

**Paso 1 — Tipo de alumno**
Elige entre:
- **Alumno nuevo** → rellena nombre, apellidos, DNI y email.
- **Alumno existente** → busca por DNI para recuperar sus datos.

**Paso 2 — Ciclo y grupo**
Selecciona el ciclo formativo (DAM, DAW…) y el grupo/turno (Mañana, Tarde…) al que se incorpora.

**Paso 3 — Asignaturas**
Marca las asignaturas en las que se matricula. Puedes elegir la **oferta completa** del curso o asignaturas sueltas.

Pulsa **Confirmar selección** para guardar la matrícula.

---

## 4. Profesores

**Menú → Profesores**

![Listado de profesores](./screenshots/profesores-lista.png)

Gestión del claustro del centro: listado, alta, edición y baja.

### Dar de alta un profesor

Pulsa **Nuevo profesor** e introduce:

| Campo | Descripción |
|-------|-------------|
| Nombre y apellidos | Nombre completo |
| DNI | Documento identificativo |
| Email | Se usará para el acceso a la plataforma |
| Fecha de nacimiento | Opcional |

Una vez creado, el profesor ya puede iniciar sesión con ese email.

---

## 5. Ciclos formativos

**Menú → Ciclos**

![Listado de ciclos](./screenshots/ciclos-lista.png)

Los ciclos son las titulaciones del centro (p. ej. *Desarrollo de Aplicaciones Multiplataforma*, *Desarrollo de Aplicaciones Web*). Cada asignatura pertenece a un ciclo.

### Crear un ciclo

Introduce el nombre del ciclo y confirma. El ciclo quedará disponible al crear asignaturas.

### Asignaciones docentes

Dentro de cada ciclo puedes gestionar qué profesor imparte qué asignatura y en qué grupo mediante el **wizard de asignaciones**:

![Wizard de asignaciones](./screenshots/ciclos-asignaciones.png)

1. Selecciona el ciclo y el curso (1.º o 2.º).
2. Para cada asignatura, asigna un profesor y un grupo.
3. Guarda las asignaciones.

> Las asignaciones docentes son la base de los horarios, las tareas y el tablón de anuncios.

---

## 6. Grupos

**Menú → Grupos**

![Listado de grupos](./screenshots/grupos-lista.png)

Los grupos representan los **turnos** en los que se divide cada ciclo (p. ej. *Mañana*, *Tarde*). Un alumno pertenece a un grupo concreto.

Desde aquí puedes crear, editar y eliminar grupos. Al crear un grupo solo se necesita su nombre.

---

## 7. Asignaturas

**Menú → Asignaturas**

![Listado de asignaturas](./screenshots/asignaturas-lista.png)

Las asignaturas se asocian siempre a un ciclo y un curso (1.º o 2.º). También se puede indicar el número de horas semanales y una descripción.

> **Acceso directo.** Al crear un ciclo, puedes abrir el formulario de asignatura con el ciclo ya preseleccionado usando el botón **+ Añadir asignatura** dentro de la vista de ciclos.

---

## 8. Horarios semanales

**Menú → Horarios**

El módulo de horarios crea las **plantillas de franjas horarias** de cada clase y permite asignar docentes y asignaturas a cada franja.

El proceso tiene dos fases:

---

### Fase 1 · Crear plantilla

![Crear plantilla horaria](./screenshots/horarios-plantilla.png)

1. **Selecciona la clase**: elige el grupo que aún no tiene plantilla horaria creada para el año escolar actual.
2. **Elige los días**: marca los días de la semana que tiene clase (L–V).
3. **Define las franjas**: indica cuántas franjas diarias tiene y el horario de cada una (formato `HH:mm`, p. ej. `08:15`).
4. Pulsa **Crear plantilla horaria**.

> El sistema calcula automáticamente el límite de franjas en función de las horas semanales totales de la asignatura.

---

### Fase 2 · Rejilla semanal

![Rejilla semanal](./screenshots/horarios-rejilla.png)

Una vez creada la plantilla, aparece la rejilla semanal: una tabla con los días como columnas y las franjas como filas.

En cada celda elige el docente y asignatura que corresponden mediante el desplegable. Las opciones se filtran automáticamente por grupo y año escolar.

Cuando todas las celdas estén cubiertas, el horario queda listo para generar sesiones de clase.

---

## 9. Sesiones de clase

**Menú → Sesiones de clase**

![Listado de sesiones](./screenshots/sesiones-lista.png)

Cada sesión representa **una clase concreta** en un día y franja horaria determinados. Se pueden crear manualmente o generarlas en bloque desde el horario.

### Cancelar clases en bloque

Pulsa **Cancelar clases en bloque** para suspender varias sesiones de una vez:

![Diálogo cancelar clases](./screenshots/sesiones-cancelar.png)

1. Indica el **rango de fechas** (desde / hasta).
2. Opcionalmente filtra por ciclo, asignatura, grupo o profesor para afinar qué sesiones se cancelan.
3. El sistema muestra una **vista previa** del número de sesiones afectadas.
4. Pulsa **Confirmar** para ejecutar la suspensión.

---

## 10. Tareas académicas

**Menú → Tareas**

![Listado de tareas](./screenshots/tareas-lista.png)

Las tareas son actividades académicas (deberes, prácticas, proyectos, exámenes…) asociadas a una asignación docente concreta (profesor + asignatura + grupo).

### Crear una tarea

1. Selecciona la **asignación docente** en el desplegable (muestra: profesor · asignatura · ciclo · curso · grupo).
2. Escribe el **título** y elige el **tipo** (Deberes, Práctica, Teoría, Proyecto, Examen).
3. Indica las **fechas** de inicio y entrega.
4. Guarda.

Los alumnos del grupo podrán ver y entregar la tarea desde su panel.

---

## 11. Entregas de alumnos

**Menú → Entregas de alumnos**

![Listado de entregas](./screenshots/entregas-lista.png)

Permite al administrador consultar y gestionar las entregas que han realizado los alumnos a cada tarea: estado (pendiente, entregada, en retraso, calificada), alumno, tarea y fecha de entrega.

---

## 12. Asistencias

**Menú → Asistencias**

![Listado de asistencias](./screenshots/asistencias-lista.png)

Registro de asistencia por sesión. Para cargar las asistencias de una sesión:

1. Selecciona la **sesión** de la que quieres registrar la asistencia.
2. Filtra por **grupo**, **asignatura** y **año escolar** y pulsa **Cargar alumnos**.
3. Aparecerá el listado de alumnos matriculados; marca el estado de asistencia de cada uno.

---

## 13. Tablón de anuncios

**Menú → Tablón de anuncios**

![Tablón de anuncios](./screenshots/tablon-lista.png)

Espacio para publicar comunicados y avisos que se mostrarán a los usuarios de la plataforma.

### Crear un anuncio

![Crear anuncio](./screenshots/tablon-crear.png)

| Campo | Descripción |
|-------|-------------|
| **Título** | Encabezado del anuncio (máx. 120 caracteres) |
| **Cuerpo** | Contenido del mensaje (máx. 2 000 caracteres) |
| **Audiencia** | A quién va dirigido (ver tabla abajo) |
| **Adjunto** | URL de un documento o recurso externo (opcional) |
| **Publicar ahora** | Si está marcado, el anuncio se publica de inmediato |
| **Fecha de expiración** | Fecha a partir de la cual el anuncio deja de mostrarse |

**Tipos de audiencia disponibles:**

| Audiencia | Destinatarios |
|-----------|---------------|
| Todo el centro | Todos los usuarios |
| Todos los alumnos | Solo alumnos |
| Todos los profesores | Solo profesores |
| Por ciclo, curso y/o grupo | Segmento concreto de alumnos |
| Asignación docente concreta | Alumnos de un docente, asignatura y grupo específicos |
| Profesor concreto | Un único profesor |

Los anuncios pueden **editarse** (icono lápiz) o **eliminarse** (icono papelera) después de publicarse.

---

## 14. Notificaciones

**Menú → Notificaciones**

![Listado de notificaciones](./screenshots/notificaciones-lista.png)

Gestión de notificaciones internas del sistema (avisos en tiempo real dentro de la plataforma). Permite crear, consultar y eliminar notificaciones.

---

## 15. Ajustes de interfaz

Disponibles en todo momento desde la **cabecera**:

| Control | Función |
|---------|---------|
| 🌙 / ☀️ Toggle de tema | Cambia entre modo claro y oscuro. La preferencia se guarda automáticamente. |
| Selector de idioma | Cambia el idioma de la interfaz: español, inglés o alemán. |
| Icono de perfil | Accede a tu ficha de usuario y opciones de sesión. |
| 🔔 Notificaciones | Muestra el contador de notificaciones pendientes. |

---

> **Ziryab** — Plataforma de gestión académica · Proyecto de Grado Superior · Curso 2025-2026
