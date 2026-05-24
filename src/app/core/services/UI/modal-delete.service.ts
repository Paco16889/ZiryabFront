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
  /** Estado interno del modal de eliminación compartido. */
  private _modalState = signal<DeleteModalState>({ isOpen: false });

  /** Estado público consumido por el componente modal. */
  modalState = this._modalState.asReadonly();

  /** Configuración de la entidad que está pendiente de confirmación de borrado. */
  private currentConfig: DeleteRequest<unknown> | null = null;

  /** Temporizador que cierra el modal tras mostrar éxito. */
  private autoCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Abre el modal con la entidad y función de borrado proporcionadas por la fila. */
  openModal(request: DeleteRequest<unknown>) {
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

  /** Ejecuta el `deleteFn`, muestra estado de carga y refleja éxito/error. */
  confirmDelete() {
    if (!this.currentConfig) return;

    this._modalState.update(state => ({
      ...state,
      isDeleting: true,
      errorMessage: ''
    }));

    this.currentConfig.deleteFn(this.currentConfig.id).subscribe({
      next: () => {
        this._modalState.update(state => ({
          ...state,
          isDeleting: false,
          showSuccess: true
        }));

        this.clearAutoCloseTimeout();
        this.autoCloseTimeout = setTimeout(() => {
          this.closeModal();
        }, 2000);
      },
      error: (err) => {
        this._modalState.update(state => ({
          ...state,
          isDeleting: false,
          errorMessage: this.getErrorMessage(err, 'eliminar')
        }));
      }
    });
  }

  /** Cierra el modal y descarta la configuración actual. */
  closeModal() {
    this.clearAutoCloseTimeout();
    this._modalState.update(state => ({
      ...state,
      isOpen: false
    }));
    this.currentConfig = null;
  }

  /** Cancela el cierre automático anterior para evitar cierres tardíos. */
  private clearAutoCloseTimeout(): void {
    if (this.autoCloseTimeout !== null) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  /** Prioriza el mensaje del backend y si no existe crea uno contextual. */
  private getErrorMessage(err: unknown, action: 'eliminar'): string {
    const backendMessage = (err as { error?: { message?: string } })?.error?.message;
    return backendMessage || `Error al ${action} ${this.currentConfig?.type}.`;
  }
}
