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
  id: number;
  recipientFirebaseUID: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | Date | null;
  createdAt: string | Date;
}