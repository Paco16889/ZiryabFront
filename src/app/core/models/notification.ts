export type NotificationEntityType =
  | 'TASK'
  | 'STUDENT_TASK'
  | 'ASSISTANCE'
  | 'SYSTEM';

export type NotificationAction =
  | 'TASK_CREATED'
  | 'TASK_DEADLINE_APPROACHING'
  | 'TASK_FINISHED'
  | 'TASK_GRADED'
  | 'TASK_SUBMITTED'
  | 'JUSTIFICATION_SUBMITTED'
  | 'JUSTIFICATION_REVIEWED';

export interface Notification {
  id:           number;
  idStudent:    number | null;
  idTeacher:    number | null;
  isRead:       boolean;
  entityType:   NotificationEntityType;
  entityId:     number;
  action:       NotificationAction;
  title:        string | null;
  body:         string | null;
  scheduledFor: Date;
  createdAt:    Date;
}