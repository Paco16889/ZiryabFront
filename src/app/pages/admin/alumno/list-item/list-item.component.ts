import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Student } from '../../../../core/models/student';
import { ViewDetailComponent } from '../view-detail/view-detail.component';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { StudentEditModalComponent } from "../student-edit-modal/student-edit-modal.component";
import { GenericDeleteModalComponent } from "../../generic-delete-modal/generic-delete-modal.component";

@Component({
  selector: 'app-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, ViewDetailComponent, StudentEditModalComponent, GenericDeleteModalComponent],
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

    toggleEdit(studentId: number) {
    this.studentService.getStudentbyId(studentId).subscribe({
      next: response => this.studentToEdit = response,
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
  
}
