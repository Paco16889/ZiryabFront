import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Student, StudentDeleteResponse, StudentUpdateRequest, StudentUpdateResponse } from '../../../../../core/models/student';

import { StudentsService } from '../../../../../core/services/admin/entities/students.service';


import { Validators } from '@angular/forms';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

/**
 * Componente que representa un elemento del listado de estudiantes.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * para el componente genérico GenericListItemComponent.
 */
@Component({
  selector: 'app-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {

   /**
   * Estudiante a mostrar en el elemento de lista.
   */
  @Input() student!: Student;

  /**
   * Evento emitido cuando el estudiante ha sido actualizado.
   */
  @Output() studentUpdated = new EventEmitter<StudentUpdateRequest>();

   /**
   * Evento emitido cuando el estudiante ha sido eliminado, incluye su identificador.
   */
  @Output() studentDeleted = new EventEmitter<number>();

  /**
   * Configuración del elemento de lista del estudiante.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición y las funciones de servicio.
   */
  studentConfig: ListItemConfig<Student, StudentUpdateRequest, StudentUpdateResponse, StudentDeleteResponse> = {
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
        className: 'text-gray-700',
        hideOnMobile: true,
        order: 4
      }, 
      {
        key: 'dni',
        className: 'text-purple-700',
        hideOnMobile: true,
        order: 5
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
        validators: [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]|[XYZ][0-9]{7}[A-Z]$/)],
        errorMessage: 'DNI inválido (formato: 12345678A/X1234567A)'
      },
      { 
        name: 'birthDate', 
        label: 'Fecha de nacimiento', 
        type: 'date',
        validators: [Validators.required],
        errorMessage: 'La fecha de nacimiento es requerida'
      }
      
    ],
    entityType: 'el estudiante',
    entityNameFormat: (student: Student) => `${student.name} ${student.surname}`,
    getByIdFn: (id: number) => this.studentService.getStudentbyId(id),
    updateFn: (data: StudentUpdateRequest) => this.studentService.updateStudent(data),
    deleteFn: (id: number) => this.studentService.deleteStudent(id)
  };


  /**
   * Configuración de la vista de detalle del estudiante.
   * Define los campos a mostrar y su formato en la vista de detalle.
   */
   studentDetailConfig: ViewDetailConfig<Student> = {
    fields: [
      {
        key: 'surname',
        type: 'title',
        format: (value: string) => `${value}`,
        className: 'text-xl font-bold'
      },
      {
        key: 'ndSurname',
        type: 'title',
        format: (value: string) => ` ${value},`,
        className: 'text-xl font-bold'
      },
      {
        key: 'name',
        type: 'title',
        format: (value: string) => ` ${value}`,
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
      },
      {
        key: 'isActive',
        label: 'Estado: ',
        type: 'text'
      }
    ]
  };

  /**
   * @param studentService - Servicio que gestiona las operaciones con estudiantes,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   */
  constructor(private studentService: StudentsService) {}


  
}
