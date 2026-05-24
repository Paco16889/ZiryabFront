/** Tipo de recurso del dominio al que puede apuntar una notificación. */
export type NotificationEntityType =
  | 'TASK'
  | 'STUDENT_TASK'
  | 'ASSISTANCE'
  | 'SYSTEM';

/** Acción de negocio que originó una notificación. */
export type NotificationAction =
  | 'TASK_CREATED'
  | 'TASK_DEADLINE_APPROACHING'
  | 'TASK_FINISHED'
  | 'TASK_GRADED'
  | 'TASK_SUBMITTED'
  | 'JUSTIFICATION_SUBMITTED'
  | 'JUSTIFICATION_REVIEWED';

/** Notificación persistida para un usuario de Firebase y mostrada en el panel superior. */
export interface Notification {
  /** Identificador único de la notificación. */
  id: number;

  /** UID de Firebase del usuario destinatario. */
  recipientFirebaseUID: string;

  /** Clave i18n o título visible de la notificación. */
  title: string;

  /** Clave i18n o mensaje visible de la notificación. */
  message: string;

  /** Categoría principal de la notificación (`TASK`, `ASSISTANCE`, etc.). */
  type: string;

  /** Indica si el usuario ya la marcó como leída. */
  isRead: boolean;

  /** Fecha de lectura, o `null` si sigue pendiente. */
  readAt: string | Date | null;

  /** Fecha de creación usada para ordenar el panel. */
  createdAt: string | Date;
}
