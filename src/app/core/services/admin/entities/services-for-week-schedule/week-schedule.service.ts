import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { WeekSchedule, WeekScheduleByIdResponse, WeekScheduleCreateRequest, WeekScheduleCreateResponse, WeekScheduleDeleteResponse, WeekSchedulesAllResponse, WeekScheduleUpdateRequest, WeekScheduleUpdateResponse } from '../../../../models/week-schedule';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { numberToPrismaDayOfWeek, prismaDayOfWeekToNumber } from '../../../../utils/week-day';

/**
 * Servicio CRUD de franjas horarias semanales.
 *
 * Centraliza la conversión entre el día numérico que usa la UI (`1` lunes…`7` domingo)
 * y el literal Prisma que espera el backend (`MONDAY`…`SUNDAY`).
 */
@Injectable({
  providedIn: 'root'
})
export class WeekScheduleService {


  /** URL base del módulo de horarios semanales en el backend. */
  private readonly apiUrl = `${environment.apiUrl}/horarios-semanales`;

  /** Cache reactiva del listado completo que consumen los listados y el builder. */
  schedules = signal<WeekSchedule[]>([]);

  /**
   * Inyecta el cliente HTTP usado en todas las operaciones del módulo.
   * @param http Cliente HTTP usado para acceder al módulo de horarios semanales.
   */
  constructor(private http: HttpClient) { }

  /**
   * Normaliza `weekDay` del API (string enum) al 1–7 interno del front.
   * @param ws Franja horaria tal como viene del backend.
   * @returns Copia de la franja con el día convertido al formato numérico de la UI.
   */
  private normalizeSchedule(ws: WeekSchedule): WeekSchedule {
    return {
      ...ws,
      weekDay: prismaDayOfWeekToNumber(ws.weekDay as unknown as string | number),
    };
  }

  /**
   * Normaliza todas las franjas de una respuesta de listado.
   * @param res Respuesta cruda del listado de horarios semanales.
   * @returns Respuesta con cada franja ya normalizada al formato de la UI.
   */
  private normalizeList(res: WeekSchedulesAllResponse): WeekSchedulesAllResponse {
    if (!res.success || !res.data?.length) {
      return res;
    }
    return {
      ...res,
      data: res.data.map((s) => this.normalizeSchedule(s)),
    };
  }

  /**
   * Carga todas las franjas horarias y actualiza `schedules`.
   * En caso de error o `success: false`, limpia la cache para evitar mostrar datos obsoletos.
   * @returns No devuelve valor; actualiza la signal `schedules` al completar la petición.
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
   * Obtiene todas las franjas horarias semanales normalizadas al formato de la UI.
   * @returns Observable con la respuesta que contiene el listado de franjas horarias
   */
   getAllSchedules(): Observable<WeekSchedulesAllResponse>{
    return this.http.get<WeekSchedulesAllResponse>(this.apiUrl).pipe(
      map((res) => this.normalizeList(res)),
      catchError(() => of({success: false, data: [], count: 0}))
    );
  }

  /**
   * Obtiene el horario semanal visible para un estudiante concreto.
   * @param idStudent - Identificador del estudiante autenticado
   * @returns Observable con las franjas horarias del estudiante
   */
  getSchedulesByStudent(idStudent: number): Observable<WeekSchedulesAllResponse> {
    return this.http.get<WeekSchedulesAllResponse>(`${this.apiUrl}/student/${idStudent}`).pipe(
      map((res) => this.normalizeList(res)),
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene todas las franjas en las que participa un profesor.
   * Lo usa el grid admin para detectar solapes con otros grupos.
   * @param idTeacher - Identificador del profesor autenticado
   * @returns Observable con las franjas horarias del profesor
   */
  getSchedulesByTeacher(idTeacher: number): Observable<WeekSchedulesAllResponse> {
    return this.http.get<WeekSchedulesAllResponse>(`${this.apiUrl}/teacher/${idTeacher}`).pipe(
      map((res) => this.normalizeList(res)),
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

  /**
   * Obtiene una franja semanal por id y normaliza su día antes de entregarla al formulario.
   * @param id - Identificador único de la franja horaria
   * @returns Observable con la respuesta que contiene la franja horaria encontrada
   */
  getWeekSchedulebyId(id: number): Observable<WeekScheduleByIdResponse> {
    return this.http.get<WeekScheduleByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      map((r) =>
        r.success && r.data
          ? { ...r, data: this.normalizeSchedule(r.data) }
          : r,
      ),
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea una franja semanal convirtiendo `weekDay` de número UI a literal Prisma.
   * @param data - Datos necesarios para crear la franja horaria
   * @returns Observable con la respuesta que contiene la franja horaria creada
   */
   createSchedule(data: WeekScheduleCreateRequest): Observable<WeekScheduleCreateResponse> {
    const body = {
      ...data,
      weekDay: numberToPrismaDayOfWeek(data.weekDay),
    };
    return this.http.post<WeekScheduleCreateResponse>(this.apiUrl, body).pipe(
      map((r) =>
        r.success && r.data
          ? { ...r, data: this.normalizeSchedule(r.data) }
          : r,
      ),
      catchError((error) => {
        console.error('Error creating schedule:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza una franja semanal enviando solo los campos presentes y traduciendo el día a Prisma.
   * @param id - Identificador único de la franja horaria a actualizar
   * @param data - Datos de la franja horaria a actualizar
   * @returns Observable con la respuesta que contiene la franja horaria actualizada
   */
  updateSchedule(id: number, data: WeekScheduleUpdateRequest): Observable<WeekScheduleUpdateResponse> {
    const body: Record<string, string | number | undefined> = { id: data.id };
    if (data.weekDay !== undefined) {
      body['weekDay'] = numberToPrismaDayOfWeek(data.weekDay);
    }
    if (data.startTime !== undefined) {
      body['startTime'] = data.startTime;
    }
    if (data.finishTime !== undefined) {
      body['finishTime'] = data.finishTime;
    }
    return this.http.patch<WeekScheduleUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      map((r) =>
        r.success && r.data
          ? { ...r, data: this.normalizeSchedule(r.data) }
          : r,
      ),
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
