import { Injectable, signal } from '@angular/core';

/** Controla la apertura/cierre del panel desplegable de notificaciones de la cabecera. */
@Injectable({
  providedIn: 'root'
})
export class NotificationToggleService {
  /** Estado interno de visibilidad del panel. */
  private readonly _isOpen = signal(false);

  /** Estado público de solo lectura consumido por la cabecera. */
  readonly isOpen = this._isOpen.asReadonly();

  /** Alterna el panel al pulsar el icono de notificaciones. */
  toggle(): void {
    this._isOpen.update((v) => !v);
  }

  /** Cierra el panel, por ejemplo al cerrar sesión o navegar. */
  close(): void {
    this._isOpen.set(false);
  }
}
