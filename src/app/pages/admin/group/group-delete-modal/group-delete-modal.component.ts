import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GroupByIdResponse } from '../../../../core/models/group';
import { GroupServiceService } from '../../../../core/services/admin/group-service.service';

@Component({
  selector: 'app-group-delete-modal',
  imports: [],
  templateUrl: './group-delete-modal.component.html',
  styleUrl: './group-delete-modal.component.scss'
})
export class GroupDeleteModalComponent {
    @Input() group!: GroupByIdResponse['data'];
    @Output() closeModal = new EventEmitter<void>();
    @Output() groupDeleted = new EventEmitter<number>();

    isDeleting = false;
    showSuccess = false;
    errorMessage = '';

    constructor(private groupService: GroupServiceService){
      
    }

    onConfirmDelete() {
      this.isDeleting = true;
      this.errorMessage = '';

      this.groupService.deleteGroup(this.group.id).subscribe({
        next: (res) => {
          this.showSuccess = true;
          this.isDeleting = false;

          setTimeout(() => {
            this.groupDeleted.emit(this.group.id);
          }, 2000);
        },
        error:(err) => {
          this.isDeleting = false;
           this.errorMessage = err.error?.message || 'Error al eliminar el grupo. Puede tener matriculas asociadas.';
        }
      });
    }

    onClose(){
      this.closeModal.emit();
    }
}




