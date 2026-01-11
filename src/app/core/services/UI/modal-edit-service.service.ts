import { Injectable, signal } from '@angular/core';
import { UpdateModalState, UpdateRequest } from '../../models/services/update-models';

@Injectable({
  providedIn: 'root'
})
export class ModalEditServiceService {

 // Signal principal del estado del modal
  private _modalState = signal<UpdateModalState>({ isOpen: false });
  
  // Exponerlo como readonly
  modalState = this._modalState.asReadonly();

  // Configuración actual (para ejecutar el update)
  private currentConfig: UpdateRequest | null = null;

  /**
   * Abrir modal (llamado desde el botón)
   */
  openModal(request: UpdateRequest) {
    this.currentConfig = request;
    this._modalState.set({
      isOpen: true,
      entityId: request.id,
      entityName: request.name,
      entityType: request.type,
      entityData: request.entityData,
      fields: request.fields,
      isUpdating: false,
      showSuccess: false,
      errorMessage: ''
    });
  }

  /**
   * Confirmar update (llamado desde el modal)
   */
  confirmUpdate( updateData: any) {
    if (!this.currentConfig) return;
    

    // Actualizar estado: eliminando
    this._modalState.update(state => ({
      ...state,
      isUpdating: true,
      errorMessage: ''
    }));
     
    // Ejecutar función de update
    this.currentConfig.updateFn(updateData).subscribe({
      next: () => {
        // Mostrar éxito
        this._modalState.update(state => ({
          ...state,
          isUpdating: false,
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
          isUpdating: false,
          errorMessage: err.error?.message || `Error al actualizar ${this.currentConfig?.type}.`
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
