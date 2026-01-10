import { Component, effect } from '@angular/core';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { Group } from '../../../../core/models/group';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';
import { GroupCreateFormComponent } from '../group-create-form/group-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';

@Component({
  selector: 'app-group-list',
  imports: [GroupListItemComponent, GroupCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss'
})
export class GroupListComponent {

  groups: Group[] = [];
  showCreateForm = false;
    
      constructor(private groupService: GroupServiceService,
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
        this.loadGroups();
      }
    });
      }
    
      ngOnInit():void {
        this.loadGroups();
      }

      loadGroups(){
        this.groupService.getGroups().subscribe({
          next: (data) => {
            console.log('Asignaturas:' ,data);
            this.groups = data;
          },
           error: (err) => console.error(err)
        });
      }

        openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onGroupCreated() {
    this.closeCreateForm();
    this.loadGroups(); // Recarga la lista
  }
  

  onGroupUpdated(updatedCourseId: number) {
    this.loadGroups();
}
}
