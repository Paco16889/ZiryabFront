// ============================================
// ENUMS
// ============================================

/**
 * Tipos de tarea disponibles en el sistema.
 * Refleja el enum `TaskType` del esquema Prisma del backend.
 */
export type TaskType = 'PRACTICE' | 'THEORY' | 'EXAM' | 'PROJECT' | 'HOMEWORK';

/**
 * Estados posibles de la entrega de un alumno para una tarea.
 * - `PENDING`   — La tarea ha sido asignada pero el alumno no ha entregado nada.
 * - `SUBMITTED` — El alumno ha realizado la entrega, pendiente de corrección.
 * - `GRADED`    — El profesor ha calificado la entrega.
 */
export type StudentTaskStatus = 'PENDING' | 'SUBMITTED' | 'GRADED';

/**
 * Estado de la asignación de un profesor a una asignatura y grupo.
 * - `ACTIVE`   — La asignación está en curso.
 * - `STANDBY`  — La asignación está en pausa o pendiente de activación.
 * - `INACTIVE` — La asignación ha finalizado.
 */
export type TeacherAssignmentStatus = 'ACTIVE' | 'STANDBY' | 'INACTIVE';

// ============================================
// MODELOS ANIDADOS
// ============================================

/**
 * Representa una agrupación opcional de tareas creada por el profesor.
 * Es una entidad débil — solo existe en tanto que tareas la referencian.
 * Se usa para agrupar visualmente las tareas en el listado del front.
 */
export interface TaskGroup {
  /** Identificador único del grupo */
  id: number;
  /** Nombre del grupo, p.ej. "Unidad 1" o "Proyecto fin de curso" */
  name: string;
  /** Fecha y hora de creación del registro en ISO 8601 */
  createdAt: string;
}

/**
 * Representa la entrega de un alumno concreto para una tarea.
 * Es generada automáticamente por el backend al crear la tarea,
 * una por cada alumno matriculado en la asignatura y grupo correspondientes.
 */
export interface StudentTask {
  /** Identificador único de la entrega */
  id: number;
  /** ID de la tarea a la que pertenece esta entrega */
  idTask: number;
  /** ID de la matrícula del alumno en la asignatura */
  idStudentEnrollment: number;
  /** Estado actual de la entrega */
  status: StudentTaskStatus;
  /** Fecha y hora en que el alumno realizó la entrega, o `null` si no ha entregado */
  submissionDate: string | null;
  /** Puntuación otorgada por el profesor, o `null` si aún no ha sido calificada */
  score: number | null;
  /** Comentario de retroalimentación del profesor, o `null` si no hay feedback */
  feedback: string | null;
  /** URL del fichero adjunto subido por el alumno, o `null` si no hay adjunto */
  attachmentUrl: string | null;
  /** Fecha y hora de creación del registro en ISO 8601 */
  createdAt: string;
}

/**
 * Representa la asignación de un profesor a una asignatura y grupo concretos.
 * Los campos `teacher`, `subject` y `group` son opcionales porque no todos
 * los endpoints expanden las relaciones completas.
 */
export interface TeacherAssignment {
  /** Identificador único de la asignación */
  id: number;
  /** ID del profesor asignado */
  idTeacher: number;
  /** ID de la asignatura */
  idSubject: number;
  /** ID del grupo */
  idGroup: number;
  /** Curso académico en formato `"YYYY-YYYY"` */
  schoolYear: string;
  /** Estado actual de la asignación */
  status: TeacherAssignmentStatus;
  /** Fecha y hora de creación del registro en ISO 8601 */
  createdAt: string;
  /** Datos del profesor. Presente solo cuando el endpoint expande la relación */
  teacher?: { id: number; name: string; surname: string; email: string };
  /** Datos de la asignatura. Presente solo cuando el endpoint expande la relación */
  subject?: { id: number; name: string };
  /** Datos del grupo. Presente solo cuando el endpoint expande la relación */
  group?: { id: number; name: string };
}

/**
 * Modelo completo de una tarea tal como la devuelve el backend,
 * incluyendo su asignación de profesor y las entregas de los alumnos.
 */
export interface Task {
  /** Identificador único de la tarea */
  id: number;
  /** ID de la asignación de profesor a la que pertenece esta tarea */
  idTeacherAssignment: number;
  /** ID del grupo al que pertenece esta tarea, o `null` si no está agrupada */
  idTaskGroup: number | null;
  /** Título de la tarea */
  title: string;
  /** Descripción detallada de la tarea, o `null` si no se ha proporcionado */
  description: string | null;
  /** Tipo de tarea */
  type: TaskType;
  /** Fecha y hora desde la que la tarea es visible para los alumnos en ISO 8601 */
  startDate: string;
  /** Fecha y hora límite de entrega en ISO 8601 */
  dueDate: string;
  /** URL del fichero adjunto subido por el profesor, o `null` si no hay adjunto */
  attachmentUrl: string | null;
  /** Curso académico al que pertenece la tarea en formato `"YYYY-YYYY"` */
  schoolYear: string;
  /** Fecha y hora de creación del registro en ISO 8601 */
  createdAt: string;
  /** Asignación de profesor a la que pertenece esta tarea */
  teacherAssignment: TeacherAssignment;
  /** Agrupación a la que pertenece esta tarea, o `null` si no está agrupada */
  taskGroup: TaskGroup | null;
  /** Lista de entregas de los alumnos. Vacía si aún no se ha generado ninguna */
  studentTasks: StudentTask[];
}

// ============================================
// RESPUESTAS DE LA API
// ============================================

/**
 * Respuesta del backend al obtener el detalle de una tarea por ID.
 *
 * @example
 * ```ts
 * this.taskService.getTaskById(9).subscribe((res: GetTaskByIdResponse) => {
 *   const task = res.data;
 * });
 * ```
 */
export interface GetTaskByIdResponse {
  /** Indica si la operación se completó sin errores */
  success: boolean;
  /** Datos completos de la tarea solicitada */
  data: Task;
}

/**
 * Respuesta del backend al listar tareas de una asignación.
 *
 * @example
 * ```ts
 * this.taskService.getTasksByAssignment(1).subscribe((res: GetTasksResponse) => {
 *   console.log(`${res.count} tareas encontradas`);
 * });
 * ```
 */
export interface GetTasksResponse {
  /** Indica si la operación se completó sin errores */
  success: boolean;
  /** Lista de tareas devuelta por el backend */
  data: Task[];
  /** Número total de tareas devueltas */
  count: number;
}

/**
 * Respuesta del backend tras crear una nueva tarea.
 *
 * @example
 * ```ts
 * this.taskService.createTask(payload).subscribe((res: CreateTaskResponse) => {
 *   console.log('Tarea creada con ID:', res.data.id);
 * });
 * ```
 */
export interface CreateTaskResponse {
  /** Indica si la operación se completó sin errores */
  success: boolean;
  /** Mensaje descriptivo devuelto por el backend */
  message: string;
  /** Datos completos de la tarea recién creada */
  data: Task;
}

/**
 * Respuesta del backend tras actualizar una tarea existente.
 *
 * @example
 * ```ts
 * this.taskService.updateTask(9, payload).subscribe((res: UpdateTaskResponse) => {
 *   console.log('Tarea actualizada:', res.data.title);
 * });
 * ```
 */
export interface UpdateTaskResponse {
  /** Indica si la operación se completó sin errores */
  success: boolean;
  /** Mensaje descriptivo devuelto por el backend */
  message: string;
  /** Datos completos de la tarea tras la actualización */
  data: Task;
}

/**
 * Respuesta del backend tras eliminar una tarea.
 *
 * @example
 * ```ts
 * this.taskService.deleteTask(9).subscribe((res: DeleteTaskResponse) => {
 *   console.log(res.message);
 * });
 * ```
 */
export interface DeleteTaskResponse {
  /** Indica si la operación se completó sin errores */
  success: boolean;
  /** Mensaje descriptivo confirmando la eliminación */
  message: string;
}

// ============================================
// REQUESTS — cuerpo de las peticiones al backend
// ============================================

/**
 * Cuerpo de la petición `POST /api/tasks` para crear una nueva tarea.
 * Todos los campos marcados sin `?` son obligatorios en el backend.
 *
 * @example
 * ```ts
 * const payload: CreateTaskRequest = {
 *   idTeacherAssignment: 1,
 *   title: 'Examen parcial',
 *   type: 'EXAM',
 *   startDate: '2025-05-01T08:00:00.000Z',
 *   dueDate: '2025-05-01T10:00:00.000Z',
 *   schoolYear: '2024-2025',
 * };
 * ```
 */
export interface CreateTaskRequest {
  /** ID de la asignación de profesor a la que pertenecerá la tarea */
  idTeacherAssignment: number;
  /** Título de la tarea */
  title: string;
  /** Descripción opcional de la tarea */
  description?: string;
  /** Tipo de tarea */
  type: TaskType;
  /** Fecha y hora desde la que la tarea será visible, en ISO 8601 */
  startDate: string;
  /** Fecha y hora límite de entrega, en ISO 8601. Debe ser posterior a `startDate` */
  dueDate: string;
  /** URL del fichero adjunto opcional subido por el profesor */
  attachmentUrl?: string;
  /** Curso académico en formato `"YYYY-YYYY"` */
  schoolYear: string;
  /** ID del grupo al que se quiere asociar la tarea. Opcional */
  idTaskGroup?: number;
}

/**
 * Cuerpo de la petición `PATCH /api/tasks/:id` para actualizar parcialmente una tarea.
 * Todos los campos son opcionales; solo se envían los que se desean modificar.
 * Pasar `null` en `description`, `attachmentUrl` o `idTaskGroup` elimina el valor existente.
 *
 * @example
 * ```ts
 * const payload: UpdateTaskRequest = {
 *   dueDate: '2025-05-02T10:00:00.000Z',
 *   attachmentUrl: null, // elimina el adjunto existente
 * };
 * ```
 */
export interface UpdateTaskRequest {
  /** Nuevo título de la tarea */
  title?: string;
  /** Nueva descripción, o `null` para eliminarla */
  description?: string | null;
  /** Nuevo tipo de tarea */
  type?: TaskType;
  /** Nueva fecha de inicio en ISO 8601 */
  startDate?: string;
  /** Nueva fecha límite de entrega en ISO 8601 */
  dueDate?: string;
  /** Nueva URL del adjunto, o `null` para eliminarlo */
  attachmentUrl?: string | null;
  /** ID del grupo al que asociar la tarea, o `null` para desasociarla */
  idTaskGroup?: number | null;
}