import { Assistance } from "./assistance";
import { WeekSchedule } from "./week-schedule";

export interface ClassSession {
  id: number;
  date: string;
  status: string;
  apointments: string | null;
  createdAt: string;
  schedule: WeekSchedule; // O el tipo completo si lo necesitas
  assistances: Assistance[];
}

export interface ClassSessionesAllResponse {
  success: boolean;
  data: ClassSession[];
  count: number;
}

export interface ClassSessionByIdResponse {
  success: boolean;
  data: ClassSession;
}

export interface ClassSessionCreateRequest {
  idSchedule: number;
  date: string;
  status?: string;
  apointments?: string;
}

export interface ClassSessionCreateResponse {
  success: boolean;
  data: ClassSession;
}

export interface ClassSessionUpdateRequest {
  date?: string;
  status?: string;
  apointments?: string;
}

export interface ClassSessionUpdateResponse {
  success: boolean;
  message: string;
  data: ClassSession;
}

export interface ClassSessionDeleteResponse {
  success: boolean;
  message: string;
}