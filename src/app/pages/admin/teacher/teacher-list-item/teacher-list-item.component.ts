import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Teacher, TeacherByIdResponse, TeachersAllResponse } from '../../../../core/models/teacher';
import { TeacherViewDetailComponent } from '../teacher-view-detail/teacher-view-detail.component';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { TeacherDeleteModalComponent } from '../teacher-delete-modal/teacher-delete-modal.component';

@Component({
  selector: 'app-teacher-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, TeacherViewDetailComponent, TeacherDeleteModalComponent],
  templateUrl: './teacher-list-item.component.html',  
  styleUrl: './teacher-list-item.component.scss'
})
export class TeacherListItemComponent {

  @Input() teacher!: Teacher;
    // @Output() courseUpdated = new EventEmitter<{id: number, name: string}>();
  @Output() teacherDeleted = new EventEmitter<number>();

  selectedTeacher: Teacher | null = null;
  
  teachers: TeachersAllResponse['data'] = [];

  teacherToDelete: TeacherByIdResponse['data'] | null = null;

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
}
