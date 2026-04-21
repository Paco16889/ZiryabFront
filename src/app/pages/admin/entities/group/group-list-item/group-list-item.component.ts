import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../../../../core/models/group';

import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';



import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { map } from 'rxjs';


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
export class GroupListItemComponent implements OnInit{

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
   * Listado de ciclos asociados al grupo.
   * Pendiente de tipar correctamente en lugar de usar any[].
   */
  coursesToShow: any[] = [];
   

  
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

   /**
   * Pendiente de implementar la carga de ciclos asociados al grupo
   * mediante loadCoursesForGroup actualmente comentado.
   */
  ngOnInit(): void {
   // this.loadCoursesForGroup();
  }
/*
  loadCoursesForGroup() {
  // Asegúrate de que group tiene id
  if (!this.group?.id) return;

  this.groupService.getGroupById(this.group.id).subscribe({
    next: (response) => {
      // TypeScript sabe que response es el tipo que devuelve tu servicio
      // Extraemos los cursos usando tus interfaces existentes
      this.coursesToShow = response.data.studentEnrollments.map(
        (item) => item.subject.course
      );

      // Logs para depuración
      console.log('=== CARGA DE CURSOS ===');
      console.log('Group:', this.group);
      console.log('Respuesta completa:', response);
      console.log('Cursos extraídos:', this.coursesToShow);
    },
    error: (err) => console.error('Error cargando cursos:', err)
  });
 
}*/

}

