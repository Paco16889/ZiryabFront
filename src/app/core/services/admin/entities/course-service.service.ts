import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Course, CourseByIdResponse, CourseCreateRequest, CourseCreateResponse, CourseDeleteResponse, CoursesAllResponse, CourseUpdateRequest, CourseUpdateResponse } from '../../../models/course';

/**
 * Servicio encargado de gestionar las operaciones con ciclos académicos.
 * Incluye una signal para mantener el estado de los ciclos en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class CourseServiceService {

  /**
   * URL base del endpoint de ciclos académicos.
   */
  private apiUrl = 'http://localhost:3000/api/courses';

    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Signal que almacena el listado de ciclos académicos en memoria.
   */
  courses = signal<Course[]>([]); // ← aquí guardaremos los cursos

   /**
   * Carga todos los ciclos académicos e inicializa la signal courses.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadCourses() {
    this.getAllCourses().subscribe(res => {
      if (res.success) {
        this.courses.set(res.data);
      } else {
        this.courses.set([]);
      }
    });
  }

  /**
   * Obtiene todos los ciclos académicos.
   * @returns Observable con la respuesta que contiene el listado de ciclos
   */
  getAllCourses(): Observable<CoursesAllResponse> {
    return this.http.get<CoursesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }

    /**
   * Obtiene un ciclo académico por su identificador.
   * @param id - Identificador único del ciclo
   * @returns Observable con la respuesta que contiene el ciclo encontrado
   */
  getCourseById(id: number): Observable<CourseByIdResponse> {
    return this.http.get<CourseByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }


    /**
   * Crea un nuevo ciclo académico.
   * @param data - Datos necesarios para crear el ciclo
   * @returns Observable con la respuesta que contiene el ciclo creado
   */
  createCourse(data: CourseCreateRequest): Observable<CourseCreateResponse> {
    return this.http.post<CourseCreateResponse>(`${this.apiUrl}`, data).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }
  
    /**
   * Actualiza un ciclo académico existente.
   * @param data - Datos del ciclo a actualizar, debe incluir el id
   * @returns Observable con la respuesta que contiene el ciclo actualizado
   */
  updateCourse(data: CourseUpdateRequest): Observable<CourseUpdateResponse> {
   
    return this.http.patch<CourseUpdateResponse>(`${this.apiUrl}/${data.id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating course:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un ciclo académico por su identificador.
   * @param id - Identificador único del ciclo a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteCourse(id: number): Observable<CourseDeleteResponse> {
    return this.http.delete<CourseDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting course:', error);
        throw error;
      })
    );
  }
}