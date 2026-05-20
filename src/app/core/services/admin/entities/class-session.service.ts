import { Injectable, signal } from '@angular/core';
import { ClassSession, ClassSessionByIdResponse, ClassSessionCreateRequest, ClassSessionCreateResponse, ClassSessionDeleteResponse, ClassSessionsAllResponse, ClassSessionUpdateRequest, ClassSessionUpdateResponse } from '../../../models/class-sessions';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Servicio encargado de gestionar las operaciones con sesiones de clase.
 * Incluye una signal para mantener el estado de las sesiones en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class ClassSessionService {
   /**
   * Signal que almacena el listado completo de sesiones de clase en memoria.
   */
  classSessions= signal<ClassSession[]>([]);
  
   /**
   * URL base del endpoint de sesiones de clase.
   */
  private apiUrl = 'http://localhost:3000/api/sessions';

    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Carga todas las sesiones de clase e inicializa la signal classSessions.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadSessions(){
    this.getAllSessions().subscribe(res => {
      if (res.success) {
        this.classSessions.set(res.data);
      } else {
        this.classSessions.set([]);
      }
    });
  }

   /**
   * Obtiene todas las sesiones de clase.
   * @returns Observable con la respuesta que contiene el listado de sesiones
   */
  getAllSessions(): Observable<ClassSessionsAllResponse>{
    return this.http.get<ClassSessionsAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data:[], count: 0}))
    );
  }

   /**
   * Obtiene una sesión de clase por su identificador.
   * @param id - Identificador único de la sesión
   * @returns Observable con la respuesta que contiene la sesión encontrada
   */
  getSessionById(id: number): Observable<ClassSessionByIdResponse> {
    return this.http.get<ClassSessionByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

   /**
   * Crea una nueva sesión de clase.
   * @param data - Datos necesarios para crear la sesión
   * @returns Observable con la respuesta que contiene la sesión creada
   */
  createSession(data: ClassSessionCreateRequest): Observable<ClassSessionCreateResponse> {
    const { appointments, ...rest } = data;
    const body = {
      ...rest,
      ...(appointments ? { apointments: appointments } : {}),
    };
    return this.http.post<ClassSessionCreateResponse>(this.apiUrl, body).pipe(
      catchError((error) => {
        console.error('Error creating session:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza una sesión de clase existente.
   * @param id - Identificador único de la sesión a actualizar
   * @param data - Datos de la sesión a actualizar
   * @returns Observable con la respuesta que contiene la sesión actualizada
   */
  updateSession(id: number, data: ClassSessionUpdateRequest): Observable<ClassSessionUpdateResponse> {
    return this.http.patch<ClassSessionUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating session:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina una sesión de clase por su identificador.
   * @param id - Identificador único de la sesión a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteSession(id: number): Observable<ClassSessionDeleteResponse> {
    return this.http.delete<ClassSessionDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting session:', error);
        throw error;
      })
    );
  }
 
}
