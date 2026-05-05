import { Component, effect, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { WithId } from '../../../../core/models/withId';

/**
 * Componente genérico que representa el modal de confirmación de eliminación.
 * Muestra tres estados: confirmación, eliminando y éxito.
 * Se sincroniza con el ModalDeleteServiceService mediante un effect
 * para reflejar el estado actual del proceso de eliminación.
 * @template T - Tipo de la entidad a eliminar, debe tener al menos un campo id
 */
@Component({
  selector: 'app-generic-delete-modal',
  imports: [TranslateModule],
  templateUrl: './generic-delete-modal.component.html',
  styleUrl: './generic-delete-modal.component.scss'
})
export class GenericDeleteModalComponent<R> {
   /**
   * Tipo de la entidad a eliminar para mostrar en los mensajes del modal,
   * por ejemplo 'estudiante', 'asignatura' o 'ciclo'.
   */
  @Input() entityType!: string; 

  /**
   * Nombre concreto de la entidad a eliminar para mostrar en el mensaje de confirmación,
   * por ejemplo 'Juan Pérez'.
   */
  @Input() entityName!: string; 

 
  
  /**
   * Indica si la petición de eliminación está en curso.
   */
  isDeleting = false;

  /**
   * Indica si la eliminación se ha completado con éxito.
   */
  showSuccess = false;

  /**
   * Mensaje de error a mostrar si la eliminación falla.
   */
  errorMessage = '';
  
    /**
   * @param deleteModalService - Servicio que gestiona el estado del modal de eliminación.
   * Se suscribe mediante un effect a los cambios de estado para sincronizar
   * las propiedades isDeleting, showSuccess y errorMessage.
   */
  constructor(private deleteModalService: ModalDeleteServiceService<R>) {
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

/**
   * Delega la confirmación de eliminación al servicio del modal.
   */
 onConfirm(){
   
   
   this.deleteModalService.confirmDelete();

 }

 /**
   * Delega el cierre del modal al servicio del modal.
   */
  onClose() {
    this.deleteModalService.closeModal();

  }
}
