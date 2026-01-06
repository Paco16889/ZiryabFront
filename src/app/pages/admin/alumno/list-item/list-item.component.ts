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

@Component({
  selector: 'app-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, ViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss'
})
export class ListItemComponent {
  @Input() student!: Student;
  @Output() studentUpdated = new EventEmitter<any>();

  //borrado
  @Output() studentDeleted = new EventEmitter<number>();

  selectedStudent: Student | null = null;
  studentToEdit: Student | null = null;
  //borrado
  studentToDelete: Student | null = null; 
  studentFields: EditFieldConfig[] = [
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
    type: 'date',  // 🆕 Esto ya muestra el calendario en el navegador
    validators: [Validators.required],
    errorMessage: 'La fecha de nacimiento es requerida'
  }
];
  
  constructor(private studentService: StudentsServiceService){}

    toggleDetail(studentId: number) {
      console.log('toggleDetail llamado con id:', studentId);
    if (this.selectedStudent?.id === studentId) {
      this.selectedStudent = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.studentService.getStudentbyId(studentId).subscribe({
        
        next: data => this.selectedStudent = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedStudent?.id);
    }
  } 

  private formatDateForInput(isoDate: string): string {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().split('T')[0];
}

toggleEdit(studentId: number) {
  this.studentService.getStudentbyId(studentId).subscribe({
    next: response => {
      this.studentToEdit = {
        ...response,
        birthDate: this.formatDateForInput(response.birthDate)
      };
    },
    error: err => console.error(err)
  });
}
  closeEditModal() {
    this.studentToEdit = null;
  }

  onStudentUpdated(updatedStudent: any) {
    this.closeEditModal();
    // Aquí podrías actualizar localmente o recargar
    this.studentUpdated.emit(updatedStudent);
  
  }

  //parte del borrado
   toggleDelete(studentId: number) { // ← Añade esto
    this.studentService.getStudentbyId(studentId).subscribe({
      next: response => this.studentToDelete = response,
      error: err => console.error(err)
    });
  }

   closeDeleteModal() { // ← Añade esto
    this.studentToDelete = null;
  }

  onStudentDeleted(deletedId: number) { // ← Añade esto
    this.closeDeleteModal();
    this.studentDeleted.emit(deletedId);
  }

  deleteStudentFn = (id: number) => this.studentService.deleteStudent(id);
  updateStudentFn = (data: any) => this.studentService.updateStudent(data);
}
