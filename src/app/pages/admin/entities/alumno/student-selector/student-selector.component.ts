import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { Student, StudentByIdResponse } from '../../../../../core/models/student';
import { BotonConfirmarStudentComponent } from "../../../botones/boton-confirmar-student/boton-confirmar-student.component";
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';

/**
 * Componente que permite buscar y seleccionar un estudiante existente por su DNI.
 * Busca en el listado de estudiantes recibido por Input y permite confirmar
 * la selección para continuar con el proceso de matriculación.
 */
@Component({
  selector: 'app-student-selector',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-selector.component.html',
  styleUrl: './student-selector.component.scss'
})
export class StudentSelectorComponent {

  /**
   * Listado de estudiantes en el que se realiza la búsqueda por DNI.
   */
 @Input() students: Student[] = []; 

 /**
   * Evento emitido cuando el usuario cancela la selección.
   */

 @Output() cancelSelection = new EventEmitter<void>();
  
 /**
   * Estudiante encontrado en la búsqueda por DNI.
   * Es null cuando no se ha realizado ninguna búsqueda o no se han encontrado resultados.
   */
  student: Student | null = null;

    /**
   * Identificador del estudiante seleccionado mediante el radio button.
   * Pendiente de revisar si es necesario o puede sustituirse por student?.id directamente.
   */
  selectedStudentId: number | null = null;

   /**
   * Mensaje de error a mostrar si el DNI es inválido o no se encuentra el estudiante.
   */
  errorMessage: string = '';

    /**
   * Formulario reactivo con el campo DNI para la búsqueda de estudiantes.
   */
  dniForm: FormGroup;

  /**
   * Evento emitido cuando el usuario confirma la selección de un estudiante.
   */
  @Output() studentSelected = new EventEmitter<Student>(); // ← Cambiado


    /**
   * Inicializa el componente.
   * @param selectedStudentService - Servicio que almacena el estudiante seleccionado
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   */
  constructor(private selectedStudentService: SelectedStudentService
    ,private fb : FormBuilder
  ) {
     this.dniForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }

/**
   * Busca un estudiante en el listado por el DNI introducido en el formulario.
   * Si el DNI no es válido marca todos los campos como tocados para mostrar los errores.
   * Si no se encuentra el estudiante muestra un mensaje de error.
   */
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

   /**
   * Confirma la selección del estudiante encontrado.
   * Emite el evento studentSelected y almacena el estudiante en el servicio de selección.
   * Pendiente de revisar la comprobación de selectedStudentId que puede ser redundante.
   */
  confirmSelection() {
    if (this.selectedStudentId && this.student?.id === this.selectedStudentId) {
      this.studentSelected.emit(this.student);
      this.selectedStudentService.setSelectedStudent(this.student);
    }
  }

  
   /**
   * Emite el evento cancelSelection para cancelar la selección.
   */
    onCancel() {
    this.cancelSelection.emit();
  }
  
}
