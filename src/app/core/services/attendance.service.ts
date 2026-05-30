import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Estados de asistencia posibles según el backend */
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'EXCUSED' | 'LATE';

/** Registro de asistencia de un alumno para el bulk */
export interface AttendanceRecord {
  /** Identificador de la sesión de clase */
  idSession: number;
  /** Identificador de la matrícula del alumno (StudentOnSubjectOnGroup.id) */
  idStudentEnrollment: number;
  /** Estado de asistencia */
  status: AttendanceStatus;
}

/**
 * Registro de asistencia de un alumno devuelto por GET /api/assistances/session/:id.
 * Incluye los datos del alumno anidados para mostrarlos en el listado.
 */
export interface SessionAttendanceEntry {
  /** Identificador del registro de asistencia */
  id: number;
  /** Estado de asistencia registrado */
  status: AttendanceStatus;
  /** Datos de la matrícula con información del alumno */
  studentEnrollment: {
    /** Nombre del alumno */
    student: {
      name: string;
      surname: string;
    };
  };
}

/**
 * Servicio encargado de gestionar el registro de asistencia.
 * Permite al profesor abrir o crear la sesión del día y guardar
 * los estados de asistencia de todos los alumnos de golpe.
 */
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  /** Cliente HTTP de Angular para realizar las peticiones a la API. */
  private http = inject(HttpClient);

  /** URL base de la API. */
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene o crea la sesión de clase de hoy para la asignatura y profesor indicados.
   * @param idSubject - Identificador de la asignatura
   * @param idTeacher - Identificador del profesor
   * @returns Observable con el id de la sesión creada o encontrada
   */
  startSession(idSubject: number, idTeacher: number): Observable<number> {
    return this.http.post<{ success: boolean; data: { id: number } }>(
      `${this.apiUrl}/sessions/start`,
      { idSubject, idTeacher }
    ).pipe(map(res => res.data.id));
  }

  /**
   * Guarda los registros de asistencia de todos los alumnos de una sesión.
   * @param records - Lista de {idSession, idStudentEnrollment, status}
   * @returns Observable con la respuesta del backend
   */
  saveBulk(records: AttendanceRecord[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/assistances/bulk`, { assistances: records });
  }

  /**
   * Obtiene el listado de alumnos con su estado de asistencia para una sesión concreta.
   * @param sessionId - Identificador de la sesión de clase
   * @returns Observable con el array de entradas de asistencia (alumno + estado)
   */
  getSessionAttendance(sessionId: number): Observable<SessionAttendanceEntry[]> {
    return this.http
      .get<{ success: boolean; data: SessionAttendanceEntry[] }>(
        `${this.apiUrl}/assistances/session/${sessionId}`
      )
      .pipe(map(res => res.data));
  }
}
