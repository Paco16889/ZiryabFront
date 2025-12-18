import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CourseByIdResponse } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';

@Component({
  selector: 'app-course-delete-modal',
  imports: [],
  templateUrl: './course-delete-modal.component.html',
  styleUrl: './course-delete-modal.component.scss'
})

export class CourseDeleteModalComponent {
  @Input() course!: CourseByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() courseDeleted = new EventEmitter<number>();

  isDeleting = false;
  showSuccess = false;
  errorMessage = '';

  constructor(private courseService: CourseServiceService) {}

  onConfirmDelete() {
    this.isDeleting = true;
    this.errorMessage = '';

    this.courseService.deleteCourse(this.course.id).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.isDeleting = false;
        
        // Espera 2 segundos y cierra el modal
        setTimeout(() => {
          this.courseDeleted.emit(this.course.id);
        }, 2000);
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message || 'Error al eliminar el curso. Puede tener asignaturas asociadas.';
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }
}

