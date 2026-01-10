import { Injectable, signal } from '@angular/core';
import { DeleteModalState, DeleteRequest } from '../../models/services/delete-models';

@Injectable({
  providedIn: 'root'
})
export class ModalDeleteServiceService {

  // Signal principal del estado del modal
  private _modalState = signal<DeleteModalState>({ isOpen: false });
  
  // Exponerlo como readonly
  modalState = this._modalState.asReadonly();

  // Configuración actual (para ejecutar el delete)
  private currentConfig: DeleteRequest | null = null;

  /**
   * Abrir modal (llamado desde el botón)
   */
  openModal(request: DeleteRequest) {
    this.currentConfig = request;
    this._modalState.set({
      isOpen: true,
      entityId: request.id,
      entityName: request.name,
      entityType: request.type,
      isDeleting: false,
      showSuccess: false,
      errorMessage: ''
    });
  }

  /**
   * Confirmar delete (llamado desde el modal)
   */
  confirmDelete() {
    if (!this.currentConfig) return;

    // Actualizar estado: eliminando
    this._modalState.update(state => ({
      ...state,
      isDeleting: true,
      errorMessage: ''
    }));

    // Ejecutar función de delete
    this.currentConfig.deleteFn(this.currentConfig.id).subscribe({
      next: () => {
        // Mostrar éxito
        this._modalState.update(state => ({
          ...state,
          isDeleting: false,
          showSuccess: true
        }));

        // Cerrar después de 2 segundos
        setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (err) => {
        // Mostrar error
        this._modalState.update(state => ({
          ...state,
          isDeleting: false,
          errorMessage: err.error?.message || `Error al eliminar ${this.currentConfig?.type}.`
        }));
      }
    });
  }

  /**
   * Cancelar/cerrar modal
   */
  closeModal() {
    this._modalState.update(state => ({
      ...state,
      isOpen : false
    }));
    this.currentConfig = null;
  }
}
