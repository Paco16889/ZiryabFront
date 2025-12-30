import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group, GroupByIdResponse, GroupsAllResponse, GroupUpdateRequest, GroupUpdateResponse } from '../../../../core/models/group';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { GroupViewDetailComponent } from '../group-view-detail/group-view-detail.component';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';
import { GroupDeleteModalComponent } from "../group-delete-modal/group-delete-modal.component";
import { GroupEditModalComponent } from "../group-edit-modal/group-edit-modal.component";

@Component({
  selector: 'app-group-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, GroupViewDetailComponent, GroupDeleteModalComponent, GroupEditModalComponent],
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
}

