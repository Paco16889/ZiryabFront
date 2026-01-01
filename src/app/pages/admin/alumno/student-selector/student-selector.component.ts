import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student, StudentByIdResponse } from '../../../../core/models/student';
import { BotonConfirmarStudentComponent } from "../boton-confirmar-student/boton-confirmar-student.component";

@Component({
  selector: 'app-student-selector',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-selector.component.html',
  styleUrl: './student-selector.component.scss'
})
export class StudentSelectorComponent {
 @Input() students: Student[] = []; // ← Recibe la lista
 @Output() cancelSelection = new EventEmitter<void>();
  
  student: Student | null = null; // ← Cambiado de StudentByIdResponse['data']
  selectedStudentId: number | null = null;
  errorMessage: string = '';

  @Output() studentSelected = new EventEmitter<Student>(); // ← Cambiado

  searchStudent(dni: string) {

  console.log('DNI a buscar:', dni);
  console.log('Lista de estudiantes recibida:', this.students);
  console.log('Cantidad de estudiantes:', this.students.length);
    if (!dni) {
      this.errorMessage = 'Introduce un DNI válido';
      return;
    }

    // Busca en la lista que recibió
    const found = this.students.find(s => s.dni === dni);
    
    if (found) {
      this.student = found;
      this.errorMessage = '';
    } else {
      this.student = null;
      this.errorMessage = 'Alumno no encontrado';
    }
  }

  confirmSelection() {
    if (this.selectedStudentId && this.student?.id === this.selectedStudentId) {
      this.studentSelected.emit(this.student);
    }
  }

  
    onCancel() {
    this.cancelSelection.emit();
  }
  
}
