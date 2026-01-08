import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Student } from '../../../../core/models/student';

import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';


import { Validators } from '@angular/forms';
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../core/configs/list-item-config';
import { GenericViewDetailComponent } from "../../generic-view-detail/generic-view-detail.component";
import { ViewDetailConfig } from '../../../../core/configs/view-detail-config';

@Component({
  selector: 'app-list-item',
  imports: [ GenericListItemComponent, GenericViewDetailComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() student!: Student;
  @Output() studentUpdated = new EventEmitter<any>();
  @Output() studentDeleted = new EventEmitter<number>();

  // Configuración del list-item
  studentConfig: ListItemConfig<Student> = {
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
    entityType: 'el estudiante',
    entityNameFormat: (student: Student) => `${student.name} ${student.surname}`,
    getByIdFn: (id: number) => this.studentService.getStudentbyId(id),
    updateFn: (data: any) => this.studentService.updateStudent(data),
    deleteFn: (id: number) => this.studentService.deleteStudent(id)
  };

   studentDetailConfig: ViewDetailConfig<Student> = {
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

  constructor(private studentService: StudentsServiceService) {}

  onStudentUpdated(updatedStudent: any) {
    this.studentUpdated.emit(updatedStudent);
  }

  onStudentDeleted(deletedId: number) {
    this.studentDeleted.emit(deletedId);
  }
}
