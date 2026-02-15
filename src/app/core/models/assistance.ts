import { ClassSession } from "./class-sessions";
import { Enrollment } from "./enrollment";

export enum AssistanceStatus {
  PRESENT = 'PRESENT',
  MISSING = 'MISSING',
  LAG = 'LAG',
  JUSTIFY = 'JUSTIFY',
}

export interface Assistance {
  id: number;
  status: AssistanceStatus;
  createdAt: string;
  session: ClassSession; // O el tipo completo si lo necesitas
  studentEnrollment: Enrollment;
}

export interface AssistancesAllResponse {
  success: boolean;
  data: Assistance[];
  count: number;
}

export interface AssistanceByIdResponse {
  success: boolean;
  data: Assistance;
}

export interface AssistanceCreateRequest {
  idSession: number;
  idStudentEnrollment: number;
  status?: AssistanceStatus;
}

export interface AssistanceCreateResponse {
  success: boolean;
  data: Assistance;
}

export interface AssistanceUpdateRequest {
  status: AssistanceStatus;
}

export interface AssistanceUpdateResponse {
  success: boolean;
  data: Assistance;
}

export interface AssistanceDeleteResponse {
  success: boolean;
  message: string;
}