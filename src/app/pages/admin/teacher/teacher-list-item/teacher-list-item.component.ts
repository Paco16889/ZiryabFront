import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { Teacher, TeacherByIdResponse, TeachersAllResponse, TeacherUpdateResponse } from '../../../../core/models/teacher';
import { TeacherViewDetailComponent } from '../teacher-view-detail/teacher-view-detail.component';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';


import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { Validators } from '@angular/forms';
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";

@Component({
  selector: 'app-teacher-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, TeacherViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent],
  templateUrl: './teacher-list-item.component.html',  
  styleUrl: './teacher-list-item.component.scss'
})
export class TeacherListItemComponent {

  @Input() teacher!: Teacher;
  @Output() teacherUpdated = new EventEmitter<any>();
  @Output() teacherDeleted = new EventEmitter<number>();

  selectedTeacher: Teacher | null = null;
  
  teachers: TeachersAllResponse['data'] = [];
  teacherToEdit: TeacherByIdResponse['data'] | null = null;
  teacherToDelete: TeacherByIdResponse['data'] | null = null;

   teacherFields: EditFieldConfig[] = [
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
  ];

  constructor(private teacherService: TeachersServiceService){}
  
  toggleDetail(teacherId: number) {
   console.log('toggleDetail llamado con id:', teacherId);
    if (this.selectedTeacher?.id === teacherId) {
      this.selectedTeacher = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.teacherService.getTeacherById(teacherId).subscribe({
        
        next: data => this.selectedTeacher = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedTeacher?.id);
    }
  }

    toggleDelete(teacherId: number) {
    this.teacherService.getTeacherById(teacherId).subscribe({
      next: response => this.teacherToDelete = response,
      error: err => console.error(err)
    });
    //abrir modal de confirmacion pero ya me abre modal de confirmacion
  }

   onTeacherDeleted(deletedTeacherId: number) {
    // Elimina de la lista local
    this.teachers = this.teachers.filter(t => t.id !== deletedTeacherId);
    
    // Si estaba seleccionado, cierra el detalle
    if (this.selectedTeacher?.id === deletedTeacherId) {
      this.selectedTeacher = null;
    }
    
    this.closeDeleteModal();

    //falta llamar al servicio de borrar teacher

    this.teacherDeleted.emit(deletedTeacherId);
  }

  closeDeleteModal(){
    this.teacherToDelete = null;
  }

   toggleEdit(teacherId: number) {
    this.teacherService.getTeacherById(teacherId).subscribe({
      next: response => this.teacherToEdit = response,
      error: err => console.error(err)
    });
  }

  closeEditModal() {
    this.teacherToEdit = null;
  }

  onTeacherUpdated(updatedTeacher: any) {
     console.log('🔍 ESTRUCTURA COMPLETA:', updatedTeacher);
  console.log('🔍 ¿Tiene .data?', updatedTeacher.data);
  console.log('🔍 teacherToEdit ANTES:', this.teacherToEdit);
    const index = this.teachers.findIndex(t => t.id === updatedTeacher.id);
   
    if (index !== -1) {
      this.teachers[index].name = updatedTeacher.name;
    }

    if (this.selectedTeacher?.id === updatedTeacher.id) {
      this.selectedTeacher!.name = updatedTeacher.name;
    }

    this.closeEditModal();
    this.teacherUpdated.emit(updatedTeacher);
  }

   deleteTeacherFn = (id: number) => this.teacherService.deleteTeacher(id);
   updateTeacherFn = (data: any) => this.teacherService.updateTeacher(data);
}
