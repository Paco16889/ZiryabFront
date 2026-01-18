import { Component, effect, Input, OnInit } from '@angular/core';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Student } from '../../../../core/models/student';
import { ListItemComponent } from '../list-item/list-item.component';

import { StudentEnrollmentComponent } from "../student-enrollment/student-enrollment.component";
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";

import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';

@Component({
  selector: 'app-list',
  imports: [ListItemComponent, StudentEnrollmentComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  students: Student[] = [];
  

   showCreateForm = false;
   
  constructor(
    private studentService: StudentsServiceService, 
    private deleteModalService: ModalDeleteServiceService,
    private updateModalService: ModalEditServiceService
  ){
    effect(() => {this.students = studentService.students()})
    //Effect que escucha cambios en el modal
    //falta effect del update
    effect(() => {
      const deleteModalState = this.deleteModalService.modalState();
      const updateModalState = this.updateModalService.modalState();
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.studentService.loadStudents();
      }

      if(!updateModalState.isOpen && updateModalState.showSuccess){
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.studentService.loadStudents();
      }
    });

  }

  ngOnInit():void {
    this.studentService.loadStudents();
  }

 

    
openCreateForm() {
  this.showCreateForm = true;
}

closeCreateForm() {
  this.showCreateForm = false;
}

  onStudentCreated() {
    this.closeCreateForm();
    this.studentService.loadStudents(); // Recarga la lista
  }

 

 
}
