import { Component, effect } from '@angular/core';
import { GroupListItemComponent } from '../group-list-item/group-list-item.component';
import { Group } from '../../../../core/models/group';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';
import { GroupCreateFormComponent } from '../group-create-form/group-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';

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
    private modalDeleteService: ModalDeleteServiceService,
    private modalUpdateService: ModalEditServiceService
  ) {
    effect(() => {
      this.groups = this.groupService.groups();
    })
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();




      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.groupService.loadGroups();
      }
      const updatemodalstate = this.modalUpdateService.modalState();

      console.log(
        '🧠 MODAL STATE Update:',
        'isOpen:', updatemodalstate.isOpen,
        'showSuccess:', updatemodalstate.showSuccess,
        'isDeleting:', updatemodalstate.isUpdating
      );
      if (!updatemodalstate.isOpen && updatemodalstate.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.groupService.loadGroups()
      }
    });



  }

  ngOnInit(): void {
    this.groupService.loadGroups();
  }

  

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onGroupCreated() {
    this.closeCreateForm();
    this.groupService.loadGroups(); // Recarga la lista
  }


 
}
