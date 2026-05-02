import { Injectable, signal } from '@angular/core';
import { DeleteModalState, DeleteRequest } from '../../models/services/delete-models';

/**
 * Servicio encargado de gestionar el estado y el ciclo de vida del modal de eliminación.
 * Centraliza la lógica de apertura, confirmación y resultado del proceso de borrado
 * para cualquier entidad del sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalDeleteService {

   /**
   * Signal privada que almacena el estado interno del modal.
   */
  private _modalState = signal<DeleteModalState>({ isOpen: false });
  
   /**
   * Signal pública de solo lectura que expone el estado del modal a los componentes.
   */
  modalState = this._modalState.asReadonly();

    /**
   * Configuración actual de la entidad pendiente de eliminar.
   * Se limpia al cerrar el modal.
   */
  private currentConfig: DeleteRequest | null = null;
  private autoCloseTimeout: ReturnType<typeof setTimeout> | null = null;

    /**
   * Abre el modal de confirmación de eliminación con los datos de la entidad a borrar.
   * @param request - Configuración de la entidad a eliminar, incluyendo id, nombre, tipo y función de borrado
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
   * Ejecuta la función de eliminación de la entidad actual.
   * Actualiza el estado del modal durante el proceso mostrando el estado de carga,
   * éxito o error según el resultado. Cierra el modal automáticamente tras dos segundos
   * si la eliminación se completa correctamente.
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
        this.clearAutoCloseTimeout();
        this.autoCloseTimeout = setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (err) => {
        // Mostrar error
        this._modalState.update(state => ({
          ...state,
          isDeleting: false,
          errorMessage: this.getErrorMessage(err, 'eliminar')
        }));
      }
    });
  }

 /**
   * Cierra el modal y limpia la configuración de la entidad actual.
   */
  closeModal() {
    this.clearAutoCloseTimeout();
    this._modalState.update(state => ({
      ...state,
      isOpen : false
    }));
    this.currentConfig = null;
  }

  private clearAutoCloseTimeout(): void {
    if (this.autoCloseTimeout !== null) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  private getErrorMessage(err: unknown, action: 'eliminar'): string {
    const backendMessage = (err as { error?: { message?: string } })?.error?.message;
    return backendMessage || `Error al ${action} ${this.currentConfig?.type}.`;
  }
}
