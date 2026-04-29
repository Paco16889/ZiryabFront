import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Teacher } from '../../../../../core/models/teacher';
import { TeacherUpdateRequest } from '../../../../../core/models/teacher';

import { TeachersServiceService } from '../../../../../core/services/admin/entities/teachers-service.service';



import { Validators } from '@angular/forms';

import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';


/**
 * Componente que representa un elemento del listado de profesores.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * para el componente genérico GenericListItemComponent.
 */
@Component({
  selector: 'app-teacher-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './teacher-list-item.component.html',  
  styleUrl: './teacher-list-item.component.scss'
})
export class TeacherListItemComponent {

  /**
   * Profesor a mostrar en el elemento de lista.
   */
@Input() teacher!: Teacher;

 /**
   * Evento emitido cuando el profesor ha sido actualizado.
   * Pendiente de sustituir any por Teacher o TeacherUpdateRequest.
   */
  @Output() teacherUpdated = new EventEmitter<TeacherUpdateRequest>();

   /**
   * Evento emitido cuando el profesor ha sido eliminado, incluye su identificador.
   */
  @Output() teacherDeleted = new EventEmitter<number>();

  /**
   * Configuración del elemento de lista del profesor.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición y las funciones de servicio.
   */
  teacherConfig: ListItemConfig<Teacher> = {
    fields: [
      { 
        key: 'surname', 
        className: 'font-medium',
        order: 1,
        format: (value) => `${value},`
      },
      { 
        key: 'ndSurname',
        order: 2
      },
      { 
        key: 'name',
        order: 3
      },
      { 
        key: 'email',
        className: 'text-sm text-gray-700',
        hideOnMobile: true,
        order: 4
      }
    ],
    actions: {
      edit: true,
      delete: true,
      detail: true
    },
    layout: {
      responsive: true
    },
    editFields: [
      { 
        name: 'email', 
        label: 'Email', 
        type: 'email', 
        validators: [Validators.required, Validators.email],
        errorMessage: 'Email inválido o requerido'
      },
      { 
        name: 'name', 
        label: 'Nombre', 
        type: 'text',
        validators: [Validators.required],
        errorMessage: 'El nombre es requerido'
      },
      { 
        name: 'surname', 
        label: 'Primer apellido', 
        type: 'text',
        validators: [Validators.required],
        errorMessage: 'El primer apellido es requerido'
      },
      { 
        name: 'ndSurname', 
        label: 'Segundo apellido', 
        type: 'text',
        validators: [Validators.required],
        errorMessage: 'El segundo apellido es requerido'
      },
      { 
        name: 'dni', 
        label: 'DNI', 
        type: 'text',
        maxlength: 9,
        validators: [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)],
        errorMessage: 'DNI inválido (formato: 12345678A)'
      },
      { 
        name: 'birthDate', 
        label: 'Fecha de nacimiento', 
        type: 'date',
        validators: [Validators.required],
        errorMessage: 'La fecha de nacimiento es requerida'
      }
    ],
    entityType: 'el profesor',
    entityNameFormat: (teacher: Teacher) => `${teacher.name} ${teacher.surname}`,
    getByIdFn: (id: number) => this.teacherService.getTeacherById(id),
    updateFn: (data: any) => this.teacherService.updateTeacher(data),
    deleteFn: (id: number) => this.teacherService.deleteTeacher(id)
  };

    /**
   * Configuración de la vista de detalle del profesor.
   * Muestra nombre completo, DNI, email, fecha de nacimiento y rol.
   */
  teacherDetailConfig: ViewDetailConfig<Teacher> = {
      fields: [
        {
          key: 'surname',
          type: 'title',
          format: (value) => `${value}`,
          className: 'text-xl font-bold'
        },
        {
          key: 'ndSurname',
          type: 'title',
          format: (value) => ` ${value},`,
          className: 'text-xl font-bold'
        },
        {
          key: 'name',
          type: 'title',
          format: (value) => ` ${value}`,
          className: 'text-xl font-bold'
        },
        {
          key: 'dni',
          label: 'DNI:',
          type: 'text'
        },
        {
          key: 'email',
          label: 'Email:',
          type: 'text'
        },
        {
          key: 'birthDate',
          label: 'Fecha nacimiento:',
          type: 'text'
        },
        {
          key: 'role',
          label: 'Role:',
          type: 'text'
        }
      ]
    };
    
      /**
   * @param teacherService - Servicio que gestiona las operaciones con profesores,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   */
  constructor(private teacherService: TeachersServiceService) {}

  
 
}
