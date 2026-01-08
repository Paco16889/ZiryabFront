import { Component, Input, OnInit } from '@angular/core';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student } from '../../../../core/models/student';
import { ListItemComponent } from '../list-item/list-item.component';
import { StudentCreateFormComponent } from "../student-create-form/student-create-form.component";
import { StudentEnrollmentComponent } from "../student-enrollment/student-enrollment.component";
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";

@Component({
  selector: 'app-list',
  imports: [ListItemComponent, StudentEnrollmentComponent, BotonCreateComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  students: Student[] = [];
  

   showCreateForm = false;
  constructor(private studentService: StudentsServiceService){}

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
        console.log('🚀 Abriendo formulario con students:', this.students);
  console.log('📊 Cantidad:', this.students.length);
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
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
