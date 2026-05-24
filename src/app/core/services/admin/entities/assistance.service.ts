import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import {
  Assistance,
  AssistanceByIdResponse,
  AssistancesAllResponse,
  AssistanceCreateRequest,
  AssistanceCreateResponse,
  AssistanceDeleteResponse,
  AssistanceUpdateRequest,
  AssistanceUpdateResponse,
} from '../../../models/assistance';
import { environment } from '../../../../../environments/environment';

/** Payload de actualización de asistencia con id añadido por el modal genérico. */
export type AssistanceUpdatePayload = AssistanceUpdateRequest & { id: number };

/**
 * Servicio encargado de gestionar las operaciones con registros de asistencia.
 * Incluye una signal para mantener el estado de las asistencias en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class AssistanceService { 
  /** Cliente HTTP para el módulo de asistencias. */
  private readonly http = inject(HttpClient);

  /** URL base del endpoint de registros de asistencia. */
  private readonly apiUrl = `${environment.apiUrl}/assistances`;

  /** Cache reactiva del listado administrativo de asistencias. */
  assistances = signal<Assistance[]>([]);

  /**
   * Carga todos los registros de asistencia e inicializa la signal assistances.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadAssistances() {
    this.getAllAssistances().subscribe(res => {
      if (res.success) {
        this.assistances.set(res.data);
      } else {
        this.assistances.set([]);
      }
    });
  }

  /**
   * Obtiene todos los registros de asistencia.
   * @returns Observable con la respuesta que contiene el listado de asistencias
   */
  getAllAssistances(): Observable<AssistancesAllResponse> {
    return this.http.get<AssistancesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene un registro de asistencia por su identificador.
   * @param id Identificador único del registro de asistencia
   * @returns Observable con la respuesta que contiene el registro encontrado
   */
  getAssistanceById(id: number): Observable<AssistanceByIdResponse> {
    return this.http.get<AssistanceByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea un nuevo registro de asistencia.
   * @param data Datos necesarios para crear el registro de asistencia
   * @returns Observable con la respuesta que contiene el registro creado
   */
  createAssistance(data: AssistanceCreateRequest): Observable<AssistanceCreateResponse> {
    return this.http.post<AssistanceCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating assistance:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un registro de asistencia existente desde el modal genérico.
   * @param payload Datos del registro a actualizar, incluido su identificador
   * @returns Observable con la respuesta que contiene el registro actualizado
   */
  updateAssistance(payload: AssistanceUpdatePayload): Observable<AssistanceUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<AssistanceUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('Error updating assistance:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un registro de asistencia por su identificador.
   * @param id Identificador único del registro a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteAssistance(id: number): Observable<AssistanceDeleteResponse> {
    return this.http.delete<AssistanceDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting assistance:', error);
        throw error;
      })
    );
  }
}

  