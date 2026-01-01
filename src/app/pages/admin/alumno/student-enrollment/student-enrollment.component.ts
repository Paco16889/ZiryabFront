import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StudentCreateFormComponent } from "../student-create-form/student-create-form.component";
import { StudentSelectorComponent } from "../student-selector/student-selector.component";
import { Student } from '../../../../core/models/student';
import { SelectedStudentServiceService } from '../../../../core/services/admin/selected-student-service.service';
import { SetRegistrationComponent } from "../set-registration/set-registration.component";
import { StudentModeSelectorComponent } from "../student-mode-selector/student-mode-selector.component";


@Component({
  selector: 'app-student-enrollment',
  imports: [StudentCreateFormComponent, SetRegistrationComponent, StudentSelectorComponent, StudentModeSelectorComponent],
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss'
})
export class StudentEnrollmentComponent implements OnChanges{
      @Input() students: Student[] = [];
       @Output() cancelCreate = new EventEmitter<void>();


       constructor(private selectedStudentService: SelectedStudentServiceService) {}
    ngOnChanges(changes: SimpleChanges) {
    if (changes['students']) {
      console.log('📦 Enrollment recibe students (ngOnChanges):', this.students);
      console.log('📊 Cantidad:', this.students.length);
    }
  }


  // modo del formulario pipe??
  mode: 'new' | 'existing' | 'set-registration' = 'new';

  setMode(mode: 'new' | 'existing' | 'set-registration') {
    this.mode = mode;
  }
  
  onCancel() {
    this.cancelCreate.emit();
  }

  onCancelStudentCreate(){
    this.onCancel();
  }

  onStudentSelected(student: Student) {
  // 1️⃣ Guardamos el student en la signal
  this.selectedStudentService.setSelectedStudent(student);

  // 2️⃣ Cambiamos la vista al siguiente nivel
    this.setMode('set-registration');

}

}
