import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Teacher, TeacherByIdResponse, TeacherCreateRequest, TeacherCreateResponse, TeacherDeleteResponse, TeachersAllResponse, TeacherUpdateRequest, TeacherUpdateResponse } from '../../../models/teacher';

/**
 * Servicio encargado de gestionar las operaciones con profesores.
 * Incluye una signal para mantener el estado de los profesores en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class TeachersServiceService {
  /**
   * URL base del endpoint de profesores.
   */
  private apiUrl = 'http://localhost:3000/api/teachers';

  /**
   * Signal que almacena el listado completo de profesores en memoria.
   */
  teachers = signal<Teacher[]>([]);
  /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }

  /**
   * Carga todos los profesores e inicializa la signal teachers.
   * Si la petición falla, la signal se establece como array vacío.
   */
  loadTeachers() {
    this.getAllTeachers().subscribe(
      response => {
        if (response) {
          this.teachers.set(response.data);
        } else {
          this.teachers.set([]);
        }
      }
    )
  }

  /**
   * Obtiene todos los profesores.
   * @returns Observable con la respuesta que contiene el listado de profesores
   */
  getAllTeachers(): Observable<TeachersAllResponse> {
    return this.http.get<TeachersAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    )
  }

  /**
   * Obtiene un profesor por su identificador.
   * @param id - Identificador único del profesor
   * @returns Observable con la respuesta que contiene el profesor encontrado
   */
  getTeacherById(id: number): Observable<TeacherByIdResponse> {
    return this.http.get<TeacherByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  /**
   * Crea un nuevo profesor.
   * @param data - Datos necesarios para crear el profesor
   * @returns Observable con la respuesta que contiene el profesor creado
   */
  createTeacher(data: TeacherCreateRequest): Observable<TeacherCreateResponse> {
    return this.http.post<TeacherCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating teacher:', error);
        throw error;
      })
    );

  }

 
  
  /**
   * Actualiza un profesor existente.
   * @param teacher - Datos del profesor a actualizar, debe incluir el id
   * @returns Observable con la respuesta que contiene el profesor actualizado
   */
  updateTeacher(teacher: TeacherUpdateRequest): Observable<TeacherUpdateResponse> {
    return this.http.patch<TeacherUpdateResponse>(`${this.apiUrl}/${teacher.id}`, teacher).pipe(
      catchError((error) => {
        console.error('Error updating teacher:', error);
        throw error;
      })
    );
  }
  
  /**
   * Elimina un profesor por su identificador.
   * @param id - Identificador único del profesor a eliminar
   * @returns Observable con la respuesta de confirmación de eliminación
   */
  deleteTeacher(id: number): Observable<TeacherDeleteResponse> {
    return this.http.delete<TeacherDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting teacher', error);
        throw error;
      })
    );
  }
}
