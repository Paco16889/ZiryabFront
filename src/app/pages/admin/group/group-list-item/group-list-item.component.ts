import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../../../core/models/group';

import { GroupServiceService } from '../../../../core/services/admin/group-service.service';



import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";
import { ViewDetailConfig } from '../../../../core/configs/view-detail-config';
import { GenericViewDetailComponent } from "../../generic-view-detail/generic-view-detail.component";

@Component({
  selector: 'app-group-list-item',
  imports: [GenericListItemComponent, GenericViewDetailComponent],
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

   groupDetailConfig: ViewDetailConfig<Group> = {
      fields: [
        {
          key: 'name',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label:'Nombre del Grupo: '
        }
    ]
    };

  constructor(private groupService: GroupServiceService) {}

  onGroupUpdated(updatedGroup: any) {
    this.groupUpdated.emit(updatedGroup);
  }

  onGroupDeleted(deletedId: number) {
    this.groupDeleted.emit(deletedId);
  }
}

