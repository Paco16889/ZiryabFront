import { Injectable, signal } from '@angular/core';
import { EnrollmentByFiltersResponse, StudentByFiltersRequest } from '../../models/enrollment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../models/student';

@Injectable({
  providedIn: 'root'
})
export class CargaStudentsporGrupoAsignaturaServiceService {

    /**
   * Signal que almacena el listado de estudiantes filtrados.
   */
  students = signal<Student[]>([]);

   private apiUrl = 'http://localhost:3000/api/enrollments';

  constructor(private http: HttpClient) {}

    /**
   * Carga los estudiantes filtrados y actualiza la signal students.
   * Si la petición falla o no devuelve datos, la signal se establece como array vacío.
   * 
   * @param idSubject Identificador de la asignatura
   * @param idGroup Identificador del grupo
   * @param schoolYear Año académico
   */
loadStudentsByFilters(filters: StudentByFiltersRequest): void {
  this.getEnrollmentsByFilters(filters)
    .subscribe(response => {
      if (response && response.success) {
        const students = response.data.map(e => e.student);
        this.students.set(students);
      } else {
        this.students.set([]);
      }
    });
}
  /**
   * Obtiene las matrículas filtradas por asignatura, grupo y año académico.
   * 
   * @param idSubject Identificador de la asignatura
   * @param idGroup Identificador del grupo
   * @param schoolYear Año académico (ej: '2024-2025')
   * @returns Observable con la respuesta de la API que incluye las matrículas y los estudiantes
   */
getEnrollmentsByFilters(
  filters: StudentByFiltersRequest
): Observable<EnrollmentByFiltersResponse> {

  const params = new HttpParams()
    .set('idSubject', filters.idSubject)
    .set('idGroup', filters.idGroup)
    .set('schoolYear', filters.schoolYear);

  return this.http.get<EnrollmentByFiltersResponse>(
    `${this.apiUrl}/by-filters`,
    { params }
  );
}
}
