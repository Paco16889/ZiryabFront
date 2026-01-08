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
import { ListItemConfig } from '../../../../core/models/list-item-config';
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";

@Component({
  selector: 'app-group-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, GroupViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent, GenericListItemComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent {
  @Input() group!: Group;
  @Output() groupUpdated = new EventEmitter<{id: number, name: string}>();
  @Output() groupDeleted = new EventEmitter<number>();

  // Configuración del list-item para groups
  groupConfig: ListItemConfig<Group> = {
    fields: [
      { 
        key: 'name',
        className: 'font-medium',
        order: 1
      }
    ],
    actions: {
      edit: true,
      delete: true,
      detail: true
    },
    layout: {
      responsive: false
    },
    editFields: [
      { 
        name: 'name', 
        label: 'Nombre del grupo', 
        type: 'text',
        placeholder: 'Ej: Grupo A',
        validators: [Validators.required],
        errorMessage: 'El nombre es requerido'
      }
    ],
    entityType: 'el grupo',
    entityNameFormat: (group: Group) => group.name,
    getByIdFn: (id: number) => this.groupService.getGroupById(id),
    updateFn: (data: any) => this.groupService.updateGroup(data),
    deleteFn: (id: number) => this.groupService.deleteGroup(id)
  };

  constructor(private groupService: GroupServiceService) {}

  onGroupUpdated(updatedGroup: any) {
    this.groupUpdated.emit(updatedGroup);
  }

  onGroupDeleted(deletedId: number) {
    this.groupDeleted.emit(deletedId);
  }
}

