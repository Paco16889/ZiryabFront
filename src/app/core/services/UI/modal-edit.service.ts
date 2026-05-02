import { Injectable, signal } from '@angular/core';
import { UpdateModalState, UpdateRequest } from '../../models/services/update-models';

/**
 * Servicio encargado de gestionar el estado y el ciclo de vida del modal de edición.
 * Centraliza la lógica de apertura, ejecución y resultado del proceso de actualización
 * para cualquier entidad del sistema.
 */
@Injectable({
  providedIn: 'root'
})
export class ModalEditService {

  /**
   * Signal privada que almacena el estado interno del modal de edición.
   */
  private _modalState = signal<UpdateModalState>({ isOpen: false });
  
 /**
   * Signal pública de solo lectura que expone el estado del modal a los componentes.
   */
  modalState = this._modalState.asReadonly();
 /**
   * Configuración actual de la entidad pendiente de actualizar.
   * Se limpia al cerrar el modal.
   */
  private currentConfig: UpdateRequest | null = null;
  private autoCloseTimeout: ReturnType<typeof setTimeout> | null = null;

 /**
   * Abre el modal de edición con los datos de la entidad a actualizar.
   * @param request - Configuración de la entidad a actualizar, incluyendo id, nombre, tipo, datos actuales y campos editables
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
   * Ejecuta la función de actualización con los datos del formulario.
   * Actualiza el estado del modal durante el proceso mostrando el estado de carga,
   * éxito o error según el resultado. Cierra el modal automáticamente tras dos segundos
   * si la actualización se completa correctamente.
   * @param updateData - Datos del formulario de edición a enviar al backend
   */
  confirmUpdate( updateData: any) {
    if (!this.currentConfig) return;
    

    // Actualizar estado: eliminando
    this._modalState.update(state => ({
      ...state,
      isUpdating: true,
      errorMessage: ''
    }));
     
   
    this.currentConfig.updateFn(updateData).subscribe({
      next: () => {
        // Mostrar éxito
        this._modalState.update(state => ({
          ...state,
          isUpdating: false,
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
          isUpdating: false,
          errorMessage: this.getErrorMessage(err, 'actualizar')
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

  private getErrorMessage(err: unknown, action: 'actualizar'): string {
    const backendMessage = (err as { error?: { message?: string } })?.error?.message;
    return backendMessage || `Error al ${action} ${this.currentConfig?.type}.`;
  }
}
