import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { Student } from '../../../../core/models/student';
import { ViewDetailComponent } from '../view-detail/view-detail.component';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';

import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { Validators } from '@angular/forms';
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../core/models/list-item-config';

@Component({
  selector: 'app-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, ViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent, GenericListItemComponent],
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
    entityType: 'el estudiante',
    entityNameFormat: (student: Student) => `${student.name} ${student.surname}`,
    getByIdFn: (id: number) => this.studentService.getStudentbyId(id),
    updateFn: (data: any) => this.studentService.updateStudent(data),
    deleteFn: (id: number) => this.studentService.deleteStudent(id)
  };

  constructor(private studentService: StudentsServiceService) {}

  onStudentUpdated(updatedStudent: any) {
    this.studentUpdated.emit(updatedStudent);
  }

  onStudentDeleted(deletedId: number) {
    this.studentDeleted.emit(deletedId);
  }
}
