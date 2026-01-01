import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student, StudentByIdResponse } from '../../../../core/models/student';
import { BotonConfirmarStudentComponent } from "../boton-confirmar-student/boton-confirmar-student.component";
import { SelectedStudentServiceService } from '../../../../core/services/admin/selected-student-service.service';

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
  dniForm: FormGroup;

  @Output() studentSelected = new EventEmitter<Student>(); // ← Cambiado

  constructor(private selectedStudentService: SelectedStudentServiceService
    ,private fb : FormBuilder
  ) {
     this.dniForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }


  searchStudent() {

    
  if (this.dniForm.invalid) {
    this.dniForm.markAllAsTouched();
    this.errorMessage = 'Introduce un DNI válido';
    return;
  }
  const dni = this.dniForm.get('dni')?.value;


  console.log('DNI a buscar:', dni);
  console.log('Lista de estudiantes recibida:', this.students);
  console.log('Cantidad de estudiantes:', this.students.length);
   

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
      this.selectedStudentService.setSelectedStudent(this.student);
    }
  }

  
    onCancel() {
    this.cancelSelection.emit();
  }
  
}
