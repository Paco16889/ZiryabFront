import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../../../../core/models/group';

import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';



import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';


/**
 * Componente que representa un elemento del listado de grupos.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * para el componente genérico GenericListItemComponent.
 */
@Component({
  selector: 'app-group-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent {

    /**
   * Grupo a mostrar en el elemento de lista.
   */
  @Input() group!: Group;

   /**
   * Evento emitido cuando el grupo ha sido actualizado.
   * Pendiente de sustituir el tipo inline por GroupUpdateRequest.
   */
  @Output() groupUpdated = new EventEmitter<{id: number, name: string}>();

    /**
   * Evento emitido cuando el grupo ha sido eliminado, incluye su identificador.
   */
  @Output() groupDeleted = new EventEmitter<number>();
  
 /**
   * Configuración del elemento de lista del grupo.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición y las funciones de servicio.
   */
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

    /**
   * Configuración de la vista de detalle del grupo.
   * Muestra únicamente el nombre del grupo.
   */
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
      
  /**
   * @param groupService - Servicio que gestiona las operaciones con grupos,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   */
  constructor(private groupService: GroupServiceService) {

  
  }

}

