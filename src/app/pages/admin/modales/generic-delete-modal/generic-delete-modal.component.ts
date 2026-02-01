import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { WithId } from '../../../../core/models/withId';

@Component({
  selector: 'app-generic-delete-modal',
  imports: [TranslateModule],
  templateUrl: './generic-delete-modal.component.html',
  styleUrl: './generic-delete-modal.component.scss'
})
export class GenericDeleteModalComponent<T extends WithId> {
  @Input() entityType!: string; // "estudiante", "asignatura", "ciclo"
  @Input() entityName!: string; // El nombre específico (ej: "Juan Pérez")
  @Input() deleteFunction!: (id: number) => Observable<T>; // Función de delete del servicio
  @Input() entityId!: number; // ID de la entidad a borrar
  
  
  isDeleting = false;
  showSuccess = false;
  errorMessage = '';
  
  constructor(private deleteModalService: ModalDeleteServiceService) {
   effect(() => {
      const modalState = this.deleteModalService.modalState();
      console.log(
    '🧠 MODAL STATE:',
    'isOpen:', modalState.isOpen,
    'showSuccess:', modalState.showSuccess,
    'isDeleting:', modalState.isDeleting
   );
   this.isDeleting = modalState.isDeleting!;
   this.showSuccess = modalState.showSuccess!;
   this.errorMessage = modalState.errorMessage!;
  });
  }


 onConfirm(){
   
   
   this.deleteModalService.confirmDelete();

 }

  onClose() {
    this.deleteModalService.closeModal();

  }
}
