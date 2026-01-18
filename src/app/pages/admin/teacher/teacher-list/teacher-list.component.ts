import { Component, effect } from '@angular/core';
import { Teacher, TeacherUpdateResponse } from '../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { TeacherListItemComponent } from '../teacher-list-item/teacher-list-item.component';
import { TeacherCreateFormComponent } from '../teacher-create-form/teacher-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';

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
      private modalDeleteService: ModalDeleteServiceService,
      private updateModalService: ModalEditServiceService
    ){
      effect(() => {
        this.teachers = teacherService.teachers();
      })//actualizar lista despues de editar falta
      effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.updateModalService.modalState();
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.teacherService.loadTeachers();
      }
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.teacherService.loadTeachers();
      }
    });
      
    }
    
  ngOnInit() {
    this.teacherService.loadTeachers();
  }
  
  

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onTeacherCreated() {
    this.closeCreateForm();
    this.teacherService.loadTeachers();
  }

  

}
