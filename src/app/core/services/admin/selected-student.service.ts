import { Injectable, signal } from '@angular/core';
import { Student } from '../../models/student';

/**
 * Servicio encargado de mantener en memoria el estudiante seleccionado en un momento dado.
 * Se utiliza como puente entre componentes que necesitan compartir el estudiante activo.
 */
@Injectable({
  providedIn: 'root'
})
export class SelectedStudentService {

  /**
   * Inicializa el servicio sin dependencias externas.
   */
  constructor() { }

    /**
   * Signal que almacena el estudiante actualmente seleccionado.
   * Su valor es null cuando no hay ningún estudiante seleccionado.
   */
  selectedStudent = signal<Student | null>(null);

  /**
   * Establece el estudiante seleccionado en la signal.
   * @param student - Estudiante a establecer como seleccionado
   */
   setSelectedStudent(student: Student) {
    this.selectedStudent.set(student);
  }
}
