import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api';

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
}
