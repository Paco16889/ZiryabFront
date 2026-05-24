import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StudentCreateFormComponent } from "../student-create-form/student-create-form.component";
import { StudentSelectorComponent } from "../student-selector/student-selector.component";
import { Student } from '../../../../../core/models/student';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { SetRegistrationComponent } from "../set-registration/set-registration.component";
import { StudentModeSelectorComponent } from "../student-mode-selector/student-mode-selector.component";

/**
 * Componente orquestador del proceso de matriculación de un estudiante.
 * Gestiona el flujo completo mostrando los distintos pasos según el modo activo:
 * creación de nuevo estudiante, selección de estudiante existente
 * o selección de ciclo y asignaturas para la matriculación.
 */
@Component({
  selector: 'app-student-enrollment',
  imports: [StudentCreateFormComponent, SetRegistrationComponent, StudentSelectorComponent, StudentModeSelectorComponent, TranslateModule],
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss'
})
export class StudentEnrollmentComponent implements OnChanges{

  /**
   * Listado de estudiantes disponibles para seleccionar en el modo de estudiante existente.
   */
      @Input() students: Student[] = [];
      /**
   * Evento emitido cuando el usuario cancela el proceso de matriculación.
   */
       @Output() cancelCreate = new EventEmitter<void>();
        /**
   * Evento emitido cuando el proceso de matriculación se completa correctamente.
   */
       @Output() studentCreated = new EventEmitter<void>();


        /**
   * @param selectedStudentService - Servicio que almacena el estudiante seleccionado
   * para compartirlo entre los componentes del flujo de matriculación
   */
       constructor(private selectedStudentService: SelectedStudentService) {}

         /**
   * Detecta cambios en el listado de estudiantes recibido por Input.
   * @param changes - Objeto con los cambios detectados en los Inputs
   */
  //se queda para desarrollo quitar en producción
    ngOnChanges(changes: SimpleChanges) {
    if (changes['students']) {
      console.log('📦 Enrollment recibe students (ngOnChanges):', this.students);
      console.log('📊 Cantidad:', this.students.length);
    }
  }

 /**
   * Modo activo del flujo de matriculación.
   * - new: formulario de creación de nuevo estudiante.
   * - existing: selector de estudiante existente.
   * - set-registration: selección de ciclo y asignaturas.
   */
  mode: 'new' | 'existing' | 'set-registration' = 'new';


    /**
   * Establece el modo activo del flujo de matriculación.
   * @param mode - Modo a activar: 'new', 'existing' o 'set-registration'
   */
  setMode(mode: 'new' | 'existing' | 'set-registration') {
    this.mode = mode;
  }
  
   /**
   * Emite el evento cancelCreate para cancelar el proceso de matriculación.
   */
  onCancel() {
    this.cancelCreate.emit();
  }

   /**
   * Cancela el formulario de creación de estudiante y vuelve al listado.
   */
  onCancelStudentCreate(){
    this.onCancel();
  }

   /**
   * Almacena el estudiante seleccionado y avanza al paso de selección de asignaturas.
   * @param student - Estudiante seleccionado en el modo de estudiante existente
   */
  onStudentSelected(student: Student) {
  // 1️⃣ Guardamos el student en la signal
  this.selectedStudentService.setSelectedStudent(student);

  // 2️⃣ Cambiamos la vista al siguiente nivel
    this.setMode('set-registration');

}

 /**
   * Avanza al paso de selección de asignaturas tras crear un nuevo estudiante.
   * @param student - Estudiante recién creado
   */
onStudentCreated(student: Student){
  this.setMode('set-registration');
}

  /**
   * Notifica al componente padre que el proceso de matriculación ha finalizado.
   */
onRegistrationFinished() {
  // 1️⃣ avisamos al ListComponent
  this.studentCreated.emit();


 
}
}
