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
  private _modalState = signal<UpdateModalState<unknown>>({ isOpen: false });

  modalState = this._modalState.asReadonly();

  private currentConfig: UpdateRequest<unknown, unknown, unknown> | null = null;
  private autoCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  openModal(request: UpdateRequest<unknown, unknown, unknown>) {
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

  confirmUpdate(updateData: unknown) {
    if (!this.currentConfig) return;

    this._modalState.update(state => ({
      ...state,
      isUpdating: true,
      errorMessage: ''
    }));

    this.currentConfig.updateFn(updateData).subscribe({
      next: () => {
        this._modalState.update(state => ({
          ...state,
          isUpdating: false,
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
          isUpdating: false,
          errorMessage: this.getErrorMessage(err, 'actualizar')
        }));
      }
    });
  }

  closeModal() {
    this.clearAutoCloseTimeout();
    this._modalState.update(state => ({
      ...state,
      isOpen: false
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
