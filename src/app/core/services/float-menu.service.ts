import { Injectable, signal } from '@angular/core';

/**
 * Servicio encargado de gestionar el estado de visibilidad del menú flotante de perfil.
 */
@Injectable({
  providedIn: 'root'
})
// ⬅️ ¡AQUÍ FALTABA EL EXPORT! Sin esto, el servicio es invisible.
export class FloatMenuService { 
  
 /**
   * Signal que almacena el estado de visibilidad del menú flotante.
   * true si el menú está abierto, false si está cerrado.
   */
  isMenuOpen = signal<boolean>(false);

  /**
   * Inicializa el servicio sin dependencias externas.
   */
  constructor() { }

  /**
   * Abre o cierra el menú de perfil alternando el valor de la señal.
   */
  toggleMenu(): void {
    
      this.isMenuOpen.set(true);
 
  }

  /**
   * Cierra explícitamente el menú.
   */
  closeMenu(): void {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
    }
  }
}
