import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Subject } from '../../models/subject'

/**
 * Servicio encargado de obtener el listado de asignaturas para la vista del estudiante.
 * Puede ser candidato a eliminación si se unifica con el SubjectServiceService del módulo admin,
 * revisar si su uso puede migrarse al servicio existente.
 */
@Injectable({
  providedIn: 'root'
})
export class SubjectServiceService {

  /**
   * URL base del endpoint de asignaturas.
   */
      private apiUrl = 'http://localhost:3000/api/subjects';


      /**
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }


   /**
   * Obtiene el listado completo de asignaturas.
   * Maneja tanto respuestas envueltas en data como respuestas directas del backend.
   * @returns Observable con el array de asignaturas o array vacío si la petición falla
   */
getSubjects(): Observable<Subject[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(res => ('data' in res ? res.data : res)),
    catchError(() => of([]))
  );
}
    
}
