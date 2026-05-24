import { inject, Injectable, signal } from '@angular/core';
import { EnrollmentByFiltersResponse, StudentByFiltersRequest } from '../../models/enrollment';
import { Observable } from 'rxjs';
import { Student } from '../../models/student';
import { EnrollmentHttpService } from '../admin/entities/services-for-week-schedule/enrollment-http.service';

/** Carga alumnos matriculados filtrando por asignatura, grupo y año académico. */
@Injectable({
  providedIn: 'root'
})
export class CargaStudentsporGrupoAsignaturaService {

    /**
   * Signal que almacena el listado de estudiantes filtrados.
   */
  students = signal<Student[]>([]);

  /** Cliente de matrículas compartido con el flujo de horarios. */
  private readonly enrollments = inject(EnrollmentHttpService);

    /**
   * Carga los estudiantes filtrados y actualiza la signal students.
   * Si la petición falla o no devuelve datos, la signal se establece como array vacío.
   * 
   * @param filters Filtros de asignatura, grupo y curso escolar.
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
   * @param filters Filtros de asignatura, grupo y curso escolar.
   * @returns Observable con la respuesta de la API que incluye las matrículas y los estudiantes
   */
getEnrollmentsByFilters(
  filters: StudentByFiltersRequest
): Observable<EnrollmentByFiltersResponse> {
  return this.enrollments.getByFilters(filters);
}
}
