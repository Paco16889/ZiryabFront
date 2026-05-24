import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  /** Traducciones para mensajes genéricos de error del modal. */
  private readonly translate = inject(TranslateService);

  /** Estado interno del modal de edición compartido. */
  private _modalState = signal<UpdateModalState<unknown>>({ isOpen: false });

  /** Estado público consumido por el componente modal. */
  modalState = this._modalState.asReadonly();

  /** Configuración de la entidad y función de actualización activas. */
  private currentConfig: UpdateRequest<unknown, unknown, unknown> | null = null;

  /** Temporizador que cierra el modal tras una actualización correcta. */
  private autoCloseTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Abre el modal con datos iniciales, campos editables y función de guardado. */
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

  /** Ejecuta la actualización con los datos validados por el formulario genérico. */
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

  /** Cierra el modal y limpia la configuración activa. */
  closeModal() {
    this.clearAutoCloseTimeout();
    this._modalState.update(state => ({
      ...state,
      isOpen: false
    }));
    this.currentConfig = null;
  }

  /** Cancela cualquier cierre automático pendiente. */
  private clearAutoCloseTimeout(): void {
    if (this.autoCloseTimeout !== null) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  /** Traduce o compone el error mostrado al usuario cuando falla la actualización. */
  private getErrorMessage(err: unknown, _action: 'actualizar'): string {
    const backendMessage = (err as { error?: { message?: string } })?.error?.message;
    if (backendMessage) {
      return backendMessage;
    }
    return this.translate.instant('editModal.updateError', {
      type: this.currentConfig?.type ?? '',
    });
  }
}
