import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../../../../core/models/course';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectServiceService } from '../../../../../core/services/admin/entities/subject-service.service';
import { Subject } from '../../../../../core/models/subject';
import { BotonConfirmarStudentComponent } from "../../../botones/boton-confirmar-student/boton-confirmar-student.component";
import { Student } from '../../../../../core/models/student';
import { StudentRegistrationService } from '../../../../../core/services/admin/student-registration.service';
import { SelectedStudentServiceService } from '../../../../../core/services/admin/selected-student-service.service';


/**
 * Componente que gestiona la selección de ciclo y asignaturas
 * para la matriculación de un estudiante.
 * Permite seleccionar asignaturas individualmente o mediante la opción
 * de oferta completa, y confirma la matriculación al servicio correspondiente.
 */
@Component({
  selector: 'app-set-registration',
  imports: [FormsModule, BotonConfirmarStudentComponent],
  templateUrl: './set-registration.component.html',
  styleUrl: './set-registration.component.scss'
})
export class SetRegistrationComponent {

   /**
   * Listado de ciclos académicos disponibles para seleccionar.
   */
  ciclos: Course[] = [];

  /**
   * Identificador del ciclo académico seleccionado actualmente.
   * Es null cuando no hay ningún ciclo seleccionado.
   */
  selectedCicloId: number | null = null;

    /**
   * Asignaturas del ciclo académico seleccionado.
   * Es null cuando no hay ningún ciclo seleccionado.
   */
  asignaturasPorCiclo: Subject[] | null = null;

    /**
   * Indica si la opción de oferta completa está seleccionada.
   * Cuando es true todas las asignaturas del ciclo quedan seleccionadas.
   */
  isOfertaCompletaSelected = false;

    /**
   * Asignaturas seleccionadas para la matriculación.
   */
  selectedSubjects: Subject[] | null = [];

   /**
   * Estudiante seleccionado para matricular, obtenido del SelectedStudentServiceService.
   */
  selectedStudent: Student | null = null;

   /**
   * Listado de estudiantes disponibles para seleccionar.
   */
   @Input() students: Student[] = []; 

   /**
   * Evento emitido cuando el formulario de matriculación se cierra.
   */
   @Output() closeForm = new EventEmitter<void>();
   
    /**
   * @param courseService - Servicio que gestiona los ciclos académicos
   * @param subjectService - Servicio que gestiona las asignaturas
   * @param studentRegService - Servicio que gestiona el proceso de matriculación
   * @param studentSelectedService - Servicio que proporciona el estudiante actualmente seleccionado
   */
    constructor(public courseService: CourseServiceService,
      public subjectService: SubjectServiceService,
      public studentRegService: StudentRegistrationService,
      public studentSelectedService: SelectedStudentServiceService
    ){
      
    }

    /**
   * Carga los ciclos y asignaturas disponibles e inicializa el estudiante seleccionado.
   */
    ngOnInit():void{
      this.courseService.loadCourses();
      this.subjectService.loadSubjects();
      this.selectedStudent = this.studentSelectedService.selectedStudent();
    }
    
     /**
   * Actualiza las asignaturas disponibles al seleccionar un ciclo.
   * Reinicia la selección de asignaturas y el estado de oferta completa.
   */
    eligeCiclo(){
      if(this.selectedCicloId == null){
        this.asignaturasPorCiclo = null;
        this.selectedSubjects = [];
        this.isOfertaCompletaSelected = false;
        return;
      }
    
      this.asignaturasPorCiclo = this.subjectService.loadByCourse(this.selectedCicloId);
            this.selectedSubjects = [];
             this.isOfertaCompletaSelected = false;

    }

      /**
   * Indica si una asignatura está seleccionada individualmente.
   * Devuelve false si la opción de oferta completa está activa.
   * @param subject - Asignatura a comprobar
   * @returns true si la asignatura está seleccionada individualmente
   */
  isSubjectSelected(subject: Subject): boolean {
  return !this.isOfertaCompletaSelected && this.selectedSubjects!.some(s => s.id === subject.id);
}

 /**
   * Activa o desactiva la selección de todas las asignaturas del ciclo.
   * Si se activa selecciona todas las asignaturas disponibles,
   * si se desactiva vacía la selección.
   * @param event - Evento del checkbox de oferta completa
   */
toggleOfertaCompleta(event: Event) {
  const input = event.target as HTMLInputElement;
  const checked = input.checked;

  this.isOfertaCompletaSelected = checked;

  if (checked) {
    this.selectedSubjects = [...this.asignaturasPorCiclo!];
  } else {
    this.selectedSubjects = [];
  }
}

 /**
   * Añade o elimina una asignatura de la selección actual.
   * Si la oferta completa estaba activa la desactiva antes de modificar la selección.
   * @param subject - Asignatura a añadir o eliminar
   * @param event - Evento del checkbox de la asignatura
   */
onToggleSubject(subject: Subject, event: Event) {
  const input = event.target as HTMLInputElement;
  const checked = input.checked;

  if (this.isOfertaCompletaSelected) {
    this.isOfertaCompletaSelected = false;
    this.selectedSubjects = [];
  }

  if (checked) {
    this.selectedSubjects!.push(subject);
  } else {
    this.selectedSubjects = this.selectedSubjects!.filter(s => s.id !== subject.id);
  }
}

 /**
   * Confirma la matriculación con las asignaturas seleccionadas y cierra el formulario.
   * Delega la ejecución al StudentRegistrationService y emite el evento closeForm.
   */
  onConfirmRegistration(){
    this.subjectService.setSelectedSubjects(this.selectedSubjects!);
    this.studentRegService.preparaDatos();
    console.log(`Aqui tenemos el id del estudiante selecionado: ${this.selectedStudent?.id}, su Dni: ${this.selectedStudent?.dni}, y su nombre: ${this.selectedStudent?.name}`);
    console.log('aqui tenemos las asignaturas selecionadas en set-register.comonent', this.selectedSubjects);

      this.closeForm.emit();
  
  }
  
}
