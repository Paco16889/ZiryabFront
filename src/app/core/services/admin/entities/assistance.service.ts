import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Assistance, AssistanceByIdResponse, AssistancesAllResponse, AssistanceCreateRequest, AssistanceCreateResponse, AssistanceDeleteResponse, AssistanceUpdateRequest, AssistanceUpdateResponse } from '../../../models/assistance';

/**
 * Servicio encargado de gestionar las operaciones con registros de asistencia.
 * Incluye una signal para mantener el estado de las asistencias en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class AssistanceService { 
  /**
   * URL base del endpoint de registros de asistencia.
   */
  private apiUrl = 'http://localhost:3000/api/assistances'; // aquí el código }

  /**
   * Signal que almacena el listado completo de registros de asistencia en memoria.
   */
  assistances = signal<Assistance[]>([]); // aquí el código }

  /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { } // aquí el código }

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
   * @param id - Identificador único del registro de asistencia
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
   * @param data - Datos necesarios para crear el registro de asistencia
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
   * Actualiza un registro de asistencia existente.
   * @param id - Identificador único del registro a actualizar
   * @param data - Datos del registro a actualizar
   * @returns Observable con la respuesta que contiene el registro actualizado
   */
  updateAssistance(id: number, data: AssistanceUpdateRequest): Observable<AssistanceUpdateResponse> {
    return this.http.patch<AssistanceUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating assistance:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un registro de asistencia por su identificador.
   * @param id - Identificador único del registro a eliminar
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

  