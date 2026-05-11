import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { WeekSchedule, WeekScheduleByIdResponse, WeekScheduleCreateRequest, WeekScheduleCreateResponse, WeekScheduleDeleteResponse, WeekSchedulesAllResponse, WeekScheduleUpdateRequest, WeekScheduleUpdateResponse } from '../../../models/week-schedule';
import { catchError, Observable, of } from 'rxjs';

/**
 * Servicio encargado de gestionar las operaciones con franjas horarias semanales.
 * Incluye una signal para mantener el estado de los horarios en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class WeekScheduleService {
  

   /**
    * URL base del endpoint de franjas horarias semanales.
    */
  private apiUrl = 'http://localhost:3000/api/horarios-semanales';

  /**
   * Signal que almacena el listado completo de franjas horarias en memoria.
   */
  schedules = signal<WeekSchedule[]>([]);

    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  

    /**
   * Carga todas las franjas horarias e inicializa la signal schedules.
   * Si la petición falla, la signal se establece como array vacío.
   */
   loadSchedules() {
    this.getAllSchedules().subscribe(res => {
      if (res.success) {
        this.schedules.set(res.data);
      } else {
        this.schedules.set([]);
      }
    });
  }

  /**
   * Obtiene todas las franjas horarias semanales.
   * @returns Observable con la respuesta que contiene el listado de franjas horarias
   */
  getAllSchedules(): Observable<WeekSchedulesAllResponse>{
    return this.http.get<WeekSchedulesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data: [], count: 0}))
    );
  }

  /**
   * Obtiene las franjas horarias semanales asociadas a un estudiante.
   * @param idStudent - Identificador del estudiante autenticado
   * @returns Observable con las franjas horarias del estudiante
   */
  getSchedulesByStudent(idStudent: number): Observable<WeekSchedulesAllResponse> {
    return this.http.get<WeekSchedulesAllResponse>(`${this.apiUrl}/student/${idStudent}`).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene las franjas horarias semanales asociadas a un profesor.
   * @param idTeacher - Identificador del profesor autenticado
   * @returns Observable con las franjas horarias del profesor
   */
  getSchedulesByTeacher(idTeacher: number): Observable<WeekSchedulesAllResponse> {
    return this.http.get<WeekSchedulesAllResponse>(`${this.apiUrl}/teacher/${idTeacher}`).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

    /**
   * Obtiene una franja horaria semanal por su identificador.
   * @param id - Identificador único de la franja horaria
   * @returns Observable con la respuesta que contiene la franja horaria encontrada
   */
  getWeekSchedulebyId(id: number): Observable<WeekScheduleByIdResponse> {
    return this.http.get<WeekScheduleByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una nueva franja horaria semanal.
   * @param data - Datos necesarios para crear la franja horaria
   * @returns Observable con la respuesta que contiene la franja horaria creada
   */
  createSchedule(data: WeekScheduleCreateRequest): Observable<WeekScheduleCreateResponse> {
    return this.http.post<WeekScheduleCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating schedule:', error);
        throw error;
      })
    );
  }
  
   /**
   * Actualiza una franja horaria semanal existente.
   * @param id - Identificador único de la franja horaria a actualizar
   * @param data - Datos de la franja horaria a actualizar
   * @returns Observable con la respuesta que contiene la franja horaria actualizada
   */
  updateSchedule(id: number, data: WeekScheduleUpdateRequest): Observable<WeekScheduleUpdateResponse> {
    return this.http.patch<WeekScheduleUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating schedule:', error);
        throw error;
      })
    );
  }
 
    /**
   * Elimina una franja horaria semanal por su identificador.
   * @param id - Identificador único de la franja horaria a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteSchedule(id: number): Observable<WeekScheduleDeleteResponse> {
    return this.http.delete<WeekScheduleDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting schedule:', error);
        throw error;
      })
    );
  }
}
