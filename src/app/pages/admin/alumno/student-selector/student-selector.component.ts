import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { StudentByIdResponse } from '../../../../core/models/student';

@Component({
  selector: 'app-student-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './student-selector.component.html',
  styleUrl: './student-selector.component.scss'
})
export class StudentSelectorComponent {
  
  student: StudentByIdResponse['data'] | null = null;
  selectedStudentId: number | null = null;
  errorMessage: string = '';

  @Output() studentSelected = new EventEmitter<StudentByIdResponse['data']>();

  constructor(private studentService: StudentsServiceService) {}

  searchStudent(dni: string) {
    if (!dni) {
      this.errorMessage = 'Introduce un DNI válido';
      return;
    }

    this.studentService.getStudentByDni(dni).subscribe({
      next: (response) => {
        console.log('response completo:', response);
        console.log('response.data:', response.data);

        this.student = response.data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.student = null;
        this.errorMessage = 'Alumno no encontrado';
        console.error(err);
      }
    });
  }

  confirmSelection() {
    if (this.selectedStudentId && this.student?.id === this.selectedStudentId) {
      this.studentSelected.emit(this.student);
    }
  }
}
