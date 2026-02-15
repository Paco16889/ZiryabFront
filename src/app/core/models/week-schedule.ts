import { Assignment } from "./assingment";

export interface WeekSchedule {
  id: number;
  weekDay: number;
  startTime: string;
  finishTime: string;
  createdAt: string;
  teacherAssignment: Assignment; // O el tipo completo si lo necesita
}

export interface WeekSchedulesAllResponse {
  success: boolean;
  data: WeekSchedule[];
  count: number;
}

export interface WeekScheduleByIdResponse {
  success: boolean;
  data: WeekSchedule;
}

export interface WeekScheduleCreateRequest {
  idTeacherAssignment: number;
  weekDay: number;
  startTime: string;
  finishTime: string;
}

export interface WeekScheduleCreateResponse {
  success: boolean;
  data: WeekSchedule;
}

export interface WeekScheduleUpdateRequest {
  weekDay?: number;
  startTime?: string;
  finishTime?: string;
}

export interface WeekScheduleUpdateResponse {
  success: boolean;
  data: WeekSchedule;
}

export interface WeekScheduleDeleteResponse {
  success: boolean;
  message: string;
}