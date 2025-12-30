import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TeacherByIdResponse } from '../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';

@Component({
  selector: 'app-teacher-delete-modal',
  imports: [],
  templateUrl: './teacher-delete-modal.component.html',
  styleUrl: './teacher-delete-modal.component.scss'
})
export class TeacherDeleteModalComponent {
   @Input() teacher!: TeacherByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() teacherDeleted = new EventEmitter<number>();

  isDeleting = false;
  showSuccess = false;
  errorMessage = '';

  constructor(private teacherService: TeachersServiceService){}


   onConfirmDelete() {
    this.isDeleting = true;
    this.errorMessage = '';
    console.log('Teacher en modal:', this.teacher.id);

    this.teacherService.deleteTeacher(this.teacher.id).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.isDeleting = false;
        
        // Espera 2 segundos y cierra el modal
        setTimeout(() => {
          this.teacherDeleted.emit(this.teacher.id);
        }, 2000);
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message || 'Error al eliminar el Profesor.';
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }

}
