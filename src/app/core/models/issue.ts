/**
 * Audiencia destino de un anuncio del tablón.
 */
export type IssueAudience =
  | 'CENTER'
  | 'ALL_TEACHERS'
  | 'ALL_STUDENTS'
  | 'GROUP'
  | 'COURSE'
  | 'SUBJECT_GROUP';

/**
 * Tipo de emisor del anuncio.
 */
export type IssueEmitterType = 'TEACHER' | 'ADMIN';

/**
 * Representa un anuncio del tablón (issue).
 */
export interface Issue {
  /** Identificador único del anuncio */
  id: number;
  /** Tipo de emisor */
  emitterType: IssueEmitterType;
  /** Identificador del emisor (profesor o admin) */
  emitterId: number;
  /** Título del anuncio */
  title: string;
  /** Cuerpo del anuncio */
  body: string;
  /** URL de adjunto opcional */
  attachmentUrl?: string | null;
  /** Audiencia destino */
  audience: IssueAudience;
  /** Grupo destino (si audience = GROUP o SUBJECT_GROUP) */
  idGroup?: number | null;
  /** Ciclo destino (si audience = COURSE) */
  idCourse?: number | null;
  /** Asignatura destino (si audience = SUBJECT_GROUP) */
  idSubject?: number | null;
  /** Si está publicado */
  isPublished: boolean;
  /** Fecha de publicación programada */
  publishAt?: string | null;
  /** Fecha de expiración */
  expiresAt?: string | null;
  /** Fecha de creación */
  createdAt: string;
}

/**
 * Respuesta de la API al consultar todos los anuncios.
 */
export interface IssuesAllResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Listado de anuncios */
  data: Issue[];
  /** Número total de anuncios devueltos */
  count: number;
}

/**
 * Respuesta de la API al consultar un anuncio por su identificador.
 */
export interface IssueByIdResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del anuncio encontrado */
  data: Issue;
}

/**
 * Datos necesarios para crear un nuevo anuncio.
 */
export interface IssueCreateRequest {
  /** Título del anuncio */
  title: string;
  /** Cuerpo del anuncio */
  body: string;
  /** Audiencia destino */
  audience: IssueAudience;
  /** Grupo destino, opcional */
  idGroup?: number;
  /** Ciclo destino, opcional */
  idCourse?: number;
  /** Asignatura destino, opcional */
  idSubject?: number;
  /** URL de adjunto, opcional */
  attachmentUrl?: string;
  /** Publicar de inmediato */
  isPublished: boolean;
  /** Fecha de publicación programada, opcional */
  publishAt?: string;
  /** Fecha de expiración, opcional */
  expiresAt?: string;
}

/**
 * Respuesta de la API tras crear un nuevo anuncio.
 */
export interface IssueCreateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del anuncio creado */
  data: Issue;
}

/**
 * Datos necesarios para actualizar un anuncio existente.
 * Todos los campos son opcionales.
 */
export interface IssueUpdateRequest {
  /** Nuevo título */
  title?: string;
  /** Nuevo cuerpo */
  body?: string;
  /** Nueva audiencia */
  audience?: IssueAudience;
  /** Nuevo grupo destino */
  idGroup?: number;
  /** Nuevo ciclo destino */
  idCourse?: number;
  /** Nueva asignatura destino */
  idSubject?: number;
  /** Nueva URL de adjunto */
  attachmentUrl?: string;
  /** Estado de publicación */
  isPublished?: boolean;
  /** Nueva fecha de publicación */
  publishAt?: string;
  /** Nueva fecha de expiración */
  expiresAt?: string;
}

/**
 * Respuesta de la API tras actualizar un anuncio.
 */
export interface IssueUpdateResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Datos del anuncio actualizado */
  data: Issue;
}

/**
 * Respuesta de la API tras eliminar un anuncio.
 */
export interface IssueDeleteResponse {
  /** Indica si la operación se ha completado correctamente */
  success: boolean;
  /** Mensaje descriptivo del resultado devuelto por el backend */
  message: string;
  /** Identificador del anuncio eliminado */
  deletedId: number;
}
