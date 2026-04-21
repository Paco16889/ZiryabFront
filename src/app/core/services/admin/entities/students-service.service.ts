import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Student, StudentByIdResponse,StudentsAllResponse, StudentCreateRequest, StudentCreateResponse, StudentDeleteResponse, StudentUpdateRequest, StudentUpdateResponse } from '../../../models/student';

/**
 * Servicio encargado de gestionar las operaciones con estudiantes.
 * Incluye una signal para mantener el estado de los estudiantes en memoria.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentsServiceService {

  /**
   * Signal que almacena el listado completo de estudiantes en memoria.
   */
   students = signal<Student[]>([]);
   

   /**
   * URL base del endpoint de estudiantes.
   */
    private apiUrl = 'http://localhost:3000/api/students';

    /**
   * Inicializa el servicio.
   * @param http - Cliente HTTP de Angular para realizar las peticiones a la API
   */
  constructor(private http: HttpClient) { }




  /**
   * Obtiene todos los estudiantes.
   * @returns Observable con la respuesta que contiene el listado de estudiantes
   */
  getAllStudents(): Observable<StudentsAllResponse>{
    return this.http.get<StudentsAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data: [], count: 0}))
    );
  }

    /**
   * Obtiene un estudiante por su identificador.
   * @param id - Identificador único del estudiante
   * @returns Observable con la respuesta que contiene el estudiante encontrado
   */
  getStudentbyId(id: number): Observable<StudentByIdResponse>{
    return this.http.get<StudentByIdResponse>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }

   /**
   * Carga todos los estudiantes e inicializa la signal students.
   * Si la petición falla, la signal se establece como array vacío.
   */
   loadStudents() {
    this.getAllStudents().subscribe(
      response => {
        if (response) {
          this.students.set(response.data);
        } else {
          this.students.set([]);
        }
      }
    );
  }

    /**
   * Crea un nuevo estudiante.
   * @param data - Datos necesarios para crear el estudiante
   * @returns Observable con la respuesta que contiene el estudiante creado
   */
  createStudent(data: StudentCreateRequest): Observable<StudentCreateResponse> {
    return this.http.post<StudentCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error Creando Estudiante:', error);
        throw error;
      })
    );
  }

    /**
   * Actualiza un estudiante existente.
   * @param student - Datos del estudiante a actualizar, debe incluir el id
   * @returns Observable con la respuesta que contiene el estudiante actualizado
   */
updateStudent(student: StudentUpdateRequest): Observable<StudentUpdateResponse> {
  return this.http.patch<StudentUpdateResponse>(`${this.apiUrl}/${student.id}`, student).pipe(
    catchError((error) => {
      console.error('Error Actualizando Estudiante:', error);
      throw error;
    })
  );
}

  /**
   * Selecciona un estudiante por su identificador como paso previo a una baja lógica.
   * No elimina el registro, sino que recupera el estudiante para posteriormente
   * actualizar el campo correspondiente que gestiona su estado activo.
   * @param id - Identificador único del estudiante
   * @returns Observable con la respuesta que contiene el estudiante seleccionado
   */

deleteStudent(id: number): Observable<StudentDeleteResponse>{

 return this.http.get<StudentDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
  catchError((error) => {
      console.error('Error Borrando Estudiante:', error);
      throw error;
    })
);
}
  
}
