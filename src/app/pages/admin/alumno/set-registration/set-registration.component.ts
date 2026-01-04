import { Component, Input } from '@angular/core';
import { Course } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';
import { Subject } from '../../../../core/models/subject';
import { BotonConfirmarStudentComponent } from "../boton-confirmar-student/boton-confirmar-student.component";
import { Student } from '../../../../core/models/student';
import { StudentRegistrationService } from '../../../../core/services/admin/student-registration.service';
import { SelectedStudentServiceService } from '../../../../core/services/admin/selected-student-service.service';

@Component({
  selector: 'app-set-registration',
  imports: [FormsModule, BotonConfirmarStudentComponent],
  templateUrl: './set-registration.component.html',
  styleUrl: './set-registration.component.scss'
})
export class SetRegistrationComponent {
  ciclos: Course[] = [];
  selectedCicloId: number | null = null;
  asignaturasPorCiclo: Subject[] | null = null;
  isOfertaCompletaSelected = false;
  selectedSubjects: Subject[] | null = [];
  selectedStudent: Student | null = null;
   @Input() students: Student[] = []; 
   
    constructor(public courseService: CourseServiceService,
      public subjectService: SubjectServiceService,
      public studentRegService: StudentRegistrationService,
      public studentSelectedService: SelectedStudentServiceService
    ){
      
    }

    ngOnInit():void{
      this.courseService.loadCourses();
      this.subjectService.loadSubjects();
      this.selectedStudent = this.studentSelectedService.selectedStudent();
    }
    
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

  isSubjectSelected(subject: Subject): boolean {
  return !this.isOfertaCompletaSelected && this.selectedSubjects!.some(s => s.id === subject.id);
}

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

  onConfirmRegistration(){
    this.subjectService.setSelectedSubjects(this.selectedSubjects!);
    this.studentRegService.preparaDatos();
    console.log(`Aqui tenemos el id del estudiante selecionado: ${this.selectedStudent?.id}, su Dni: ${this.selectedStudent?.dni}, y su nombre: ${this.selectedStudent?.name}`);
    console.log('aqui tenemos las asignaturas selecionadas en set-register.comonent', this.selectedSubjects);
  
  }
  
}
