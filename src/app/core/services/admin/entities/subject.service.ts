import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Subject, SubjectByIdResponse, SubjectCreateRequest, SubjectCreateResponse, SubjectDeleteResponse, SubjectsAllResponse, SubjectUpdateRequest, SubjectUpdateResponse } from '../../../models/subject';

/**
 * Servicio encargado de gestionar las operaciones con asignaturas.
 * Incluye signals para mantener el estado de las asignaturas en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class SubjectService {
   /**
   * Signal que almacena el listado completo de asignaturas en memoria.
   */
  subjects = signal<Subject[]>([]);

  /**
   * Signal que almacena las asignaturas seleccionadas en un momento dado.
   */
  selectedSubjects = signal<Subject[]>([]);

  /**
   * URL base del endpoint de asignaturas.
   */
  private apiUrl = 'http://localhost:3000/api/subjects';

  /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Carga todas las asignaturas e inicializa la signal subjects.
   * Si la petición falla, la signal se establece como array vacío.
   */
 loadSubjects() {
    this.getAllSubjects().subscribe(
      response => {
        if (response) {
          this.subjects.set(response.data);
        }else{
          this.subjects.set([]);
        }
      }
    )
  }

  /**
   * Filtra las asignaturas en memoria por el identificador de ciclo académico.
   * No realiza ninguna petición HTTP, opera directamente sobre la signal subjects.
   * @param courseId - Identificador del ciclo académico por el que filtrar
   * @returns Array de asignaturas pertenecientes al ciclo indicado
   */
  loadByCourse(courseId: number): Subject[]{
    const result = this.subjects().filter(
      s => s.idCourse === courseId
    );

    return result;
  }


  /**
   * Obtiene todas las asignaturas.
   * @returns Observable con la respuesta que contiene el listado de asignaturas
   */
getAllSubjects(): Observable<SubjectsAllResponse> {
  return this.http.get<SubjectsAllResponse>(this.apiUrl).pipe(
    catchError(() => of({ success: false, data: [], count: 0 }))
  );
}

  /**
   * Obtiene una asignatura por su identificador.
   * @param id - Identificador único de la asignatura
   * @returns Observable con la respuesta que contiene la asignatura encontrada
   */
getSubjectbyId(id: number): Observable<SubjectByIdResponse> {
    return this.http.get<SubjectByIdResponse>(`${this.apiUrl}/${id}`)
    .pipe(catchError((error) => {
      console.error('Error:', error);
      throw error;
    }));
  }

   /**
   * Crea una nueva asignatura.
   * @param data - Datos necesarios para crear la asignatura
   * @returns Observable con la respuesta que contiene la asignatura creada
   */
  createSubject(data: SubjectCreateRequest): Observable<SubjectCreateResponse> {
    return this.http.post<SubjectCreateResponse>(`${this.apiUrl}`, data).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }

 
 /**
   * Actualiza una asignatura existente.
   * @param id - Identificador único de la asignatura a actualizar
   * @param data - Datos de la asignatura a actualizar
   * @returns Observable con la respuesta que contiene la asignatura actualizada
   */
 updateSubject(id: number, data: SubjectUpdateRequest): Observable<SubjectUpdateResponse> {
  return this.http.patch<SubjectUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
    catchError((error) => {
      console.error('Error updating subject:', error);
      throw error;
    })
  );
}

   /**
   * Elimina una asignatura por su identificador.
   * @param id - Identificador único de la asignatura a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteSubject(id: number): Observable<SubjectDeleteResponse>{
     return this.http.delete<SubjectDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
    catchError((error) => {
      console.error('Error deleting subject:', error);
      throw error;
    })
  );
  }


   /**
   * Establece las asignaturas seleccionadas en la signal selectedSubjects.
   * @param subjects - Array de asignaturas a establecer como seleccionadas
   */
   setSelectedSubjects(subjects: Subject[]){
    
    this.selectedSubjects.set(subjects);
    console.log('aqui tenemos las selected subjects del setSelectedsubjects');
   }
}
