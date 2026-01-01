import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StudentCreateFormComponent } from "../student-create-form/student-create-form.component";
import { StudentSelectorComponent } from "../student-selector/student-selector.component";
import { Student } from '../../../../core/models/student';


@Component({
  selector: 'app-student-enrollment',
  imports: [StudentCreateFormComponent, StudentSelectorComponent],
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss'
})
export class StudentEnrollmentComponent implements OnChanges{
      @Input() students: Student[] = [];
       @Output() cancelCreate = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges) {
    if (changes['students']) {
      console.log('📦 Enrollment recibe students (ngOnChanges):', this.students);
      console.log('📊 Cantidad:', this.students.length);
    }
  }


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
