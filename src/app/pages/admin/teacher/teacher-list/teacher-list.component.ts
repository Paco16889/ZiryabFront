import { Component, effect } from '@angular/core';
import { Teacher, TeacherUpdateResponse } from '../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { TeacherListItemComponent } from '../teacher-list-item/teacher-list-item.component';
import { TeacherCreateFormComponent } from '../teacher-create-form/teacher-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';

@Component({
  selector: 'app-teacher-list',
  imports: [TeacherListItemComponent, TeacherCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
    teachers: Teacher[] = [];
    showCreateForm = false;
    constructor(private teacherService: TeachersServiceService,
      private modalDeleteService: ModalDeleteServiceService
    ){
      effect(() => {
      const modalState = this.modalDeleteService.modalState();
      console.log(
    '🧠 MODAL STATE:',
    'isOpen:', modalState.isOpen,
    'showSuccess:', modalState.showSuccess,
    'isDeleting:', modalState.isDeleting
  );
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!modalState.isOpen && modalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.loadTeachers();
      }
    });
      
    }
    
  ngOnInit() {
    this.loadTeachers();
  }
  
  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (response) => {
        this.teachers = response;
      }
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onTeacherCreated() {
    this.closeCreateForm();
    this.loadTeachers();
  }

  

   onTeacherUpdated(updatedTeacher: TeacherUpdateResponse) {
    this.loadTeachers();
  }
}
