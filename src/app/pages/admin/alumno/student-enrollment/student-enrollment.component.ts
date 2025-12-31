import { Component, EventEmitter, Output } from '@angular/core';
import { StudentCreateFormComponent } from "../student-create-form/student-create-form.component";
import { StudentSelectorComponent } from "../student-selector/student-selector.component";


@Component({
  selector: 'app-student-enrollment',
  imports: [StudentCreateFormComponent, StudentSelectorComponent],
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss'
})
export class StudentEnrollmentComponent {

       @Output() cancelCreate = new EventEmitter<void>();

  // modo del formulario pipe??
  mode: 'new' | 'existing' = 'new';

  setMode(mode: 'new' | 'existing') {
    this.mode = mode;
  }

  onCancel() {
    this.cancelCreate.emit();
  }

  onCancelStudentCreate(){
    this.onCancel();
  }
}
