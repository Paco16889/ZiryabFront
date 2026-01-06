import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, GroupByIdResponse, GroupsAllResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../../../core/models/group';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { GroupViewDetailComponent } from '../group-view-detail/group-view-detail.component';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';


import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-group-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, GroupViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent {
   @Input() group!:Group;
   @Output() groupDeleted = new EventEmitter<number>();
  @Output() groupUpdated = new EventEmitter<GroupUpdateResponse>();
   selectedGroup: Group | null = null;
   groupToDelete: GroupByIdResponse['data'] | null = null;
   groupToEdit: GroupByIdResponse['data'] | null = null;
   groups: GroupsAllResponse['data'] = [];

  groupFields: EditFieldConfig[] = [
    { 
      name: 'name', 
      label: 'Nombre del grupo', 
      type: 'text',
      placeholder: 'Ej: Grupo A',
      validators: [Validators.required],
      errorMessage: 'El nombre es requerido'
    }
  ];
  constructor(private groupService: GroupServiceService){}


  toggleDetail(groupId: number) {
      console.log('toggleDetail llamado con id:', groupId);
    if (this.selectedGroup?.id === groupId) {
      this.selectedGroup = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.groupService.getGroupById(groupId).subscribe({
        
        next: data => this.selectedGroup = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedGroup?.id);
    }
  }

  toggleDelete(groupId: number){
    this.groupService.getGroupById(groupId).subscribe({
      next: response => this.groupToDelete = response,
      error: err => console.error(err)
    });
  }

  toggleEdit(groupId: number) {
    this.groupService.getGroupById(groupId).subscribe({
      next: response => this.groupToEdit = response,
      error: err => console.error(err)
    });
  }
  onGroupDeleted(deletedGroupId: number){
    this.groups = this.groups.filter(g => g.id !== deletedGroupId);

    if (this.selectedGroup?.id === deletedGroupId) {
      this.selectedGroup = null;
    }

    this.closeDeleteModal();

    this.groupDeleted.emit(deletedGroupId);

  }

  closeDeleteModal(){
    this.groupToDelete = null;
  }

  onGroupUpdated(groupToUpdate: GroupUpdateResponse){
      this.closeEditModal();
      this.groupUpdated.emit(groupToUpdate); // ← Cambia a groupEdited

  }

  closeEditModal(){
    this.groupToEdit = null;
  }

   deleteGroupFn = (id: number) => this.groupService.deleteGroup(id);
   updateGroupFn = (data: any) => this.groupService.updateGroup(data);
}

