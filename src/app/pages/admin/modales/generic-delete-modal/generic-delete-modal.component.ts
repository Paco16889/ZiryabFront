import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';

@Component({
  selector: 'app-generic-delete-modal',
  imports: [TranslateModule],
  templateUrl: './generic-delete-modal.component.html',
  styleUrl: './generic-delete-modal.component.scss'
})
export class GenericDeleteModalComponent {
  @Input() entityType!: string; // "estudiante", "asignatura", "ciclo"
  @Input() entityName!: string; // El nombre específico (ej: "Juan Pérez")
  @Input() deleteFunction!: (id: number) => Observable<any>; // Función de delete del servicio
  @Input() entityId!: number; // ID de la entidad a borrar
  
  

  constructor(private deleteModalService: ModalDeleteServiceService) {

  }

  isDeleting = false;
  showSuccess = false;
  errorMessage = '';

 onConfirm(){
  this.deleteModalService.confirmDelete();
 }

  onClose() {
    this.deleteModalService.closeModal();
  }
}
