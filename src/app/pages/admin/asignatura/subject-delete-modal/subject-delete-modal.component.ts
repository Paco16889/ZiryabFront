import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SubjectByIdResponse } from '../../../../core/models/subject';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';

@Component({
  selector: 'app-subject-delete-modal',
  imports: [],
  templateUrl: './subject-delete-modal.component.html',
  styleUrl: './subject-delete-modal.component.scss'
})
export class SubjectDeleteModalComponent {
   @Input() subject!: SubjectByIdResponse['data'];
  @Output() closeModal = new EventEmitter<void>();
  @Output() subjectDeleted = new EventEmitter<number>();

  isDeleting = false;
  showSuccess = false;
  errorMessage = '';

  constructor(private subjectService: SubjectServiceService) {}

  onConfirmDelete() {
    this.isDeleting = true;
    this.errorMessage = '';

    this.subjectService.deleteSubject(this.subject.id).subscribe({
      next: (response) => {
        this.showSuccess = true;
        this.isDeleting = false;
        
        // Espera 2 segundos y cierra el modal
        setTimeout(() => {
          this.subjectDeleted.emit(this.subject.id);
        }, 2000);
      },
      error: (err) => {
        this.isDeleting = false;
        this.errorMessage = err.error?.message || 'Error al eliminar la asignatura.';
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }
}
