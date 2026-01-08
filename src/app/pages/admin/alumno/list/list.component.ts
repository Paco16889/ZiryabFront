import { Component, Input, OnInit } from '@angular/core';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student } from '../../../../core/models/student';
import { ListItemComponent } from '../list-item/list-item.component';

import { StudentEnrollmentComponent } from "../student-enrollment/student-enrollment.component";
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { CreateFormStateServiceService } from '../../../../core/services/UI/create-form-state-service.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  imports: [ListItemComponent, StudentEnrollmentComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  students: Student[] = [];
  

   showCreateForm = false;
   readonly UI_KEY = 'students';
  constructor(private studentService: StudentsServiceService, public createFormState: CreateFormStateServiceService){}

  ngOnInit():void {
    this.loadStudents();
  }

  loadStudents(){
    this.studentService.getStudents().subscribe({
      next: (data) => {
        console.log('Estudiantes recibidos', data);
        this.students = data;
      },
      error: (err) => console.error(err)
    });
  }

    
openCreateForm() {
  this.createFormState.open(this.UI_KEY);
}

closeCreateForm() {
  this.createFormState.close(this.UI_KEY);
}

  onStudentCreated() {
    this.closeCreateForm();
    this.loadStudents(); // Recarga la lista
  }

  onStudentUpdated(updatedStudent: any) { // ← Añade esto
    this.loadStudents();
  }

  onStudentDeleted(deletedId: number) { // ← Añade esto
    this.loadStudents();
  }
}
