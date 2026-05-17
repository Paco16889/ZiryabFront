import { inject, Injectable, signal } from '@angular/core';
import { EnrollmentByFiltersResponse, StudentByFiltersRequest } from '../../models/enrollment';
import { Observable } from 'rxjs';
import { Student } from '../../models/student';
import { EnrollmentHttpService } from '../admin/entities/services-for-week-schedule/enrollment-http.service';

@Injectable({
  providedIn: 'root'
})
export class CargaStudentsporGrupoAsignaturaService {

    /**
   * Signal que almacena el listado de estudiantes filtrados.
   */
  students = signal<Student[]>([]);

  private readonly enrollments = inject(EnrollmentHttpService);

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
  return this.enrollments.getByFilters(filters);
}
}
