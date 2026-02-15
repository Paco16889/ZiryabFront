import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../../../../core/models/group';

import { GroupServiceService } from '../../../../../core/services/admin/entities/group-service.service';



import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { GenericViewDetailComponent } from "../../../generic-view-detail/generic-view-detail.component";
import { map } from 'rxjs';

@Component({
  selector: 'app-group-list-item',
  imports: [GenericListItemComponent, GenericViewDetailComponent],
  templateUrl: './group-list-item.component.html',
  styleUrl: './group-list-item.component.scss'
})
export class GroupListItemComponent implements OnInit{
  @Input() group!: Group;
  @Output() groupUpdated = new EventEmitter<{id: number, name: string}>();
  @Output() groupDeleted = new EventEmitter<number>();

  coursesToShow: any[] = [];
   

  

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
      

  constructor(private groupService: GroupServiceService) {

  
  }
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

