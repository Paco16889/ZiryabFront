import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
// ⬅️ ¡AQUÍ FALTABA EL EXPORT! Sin esto, el servicio es invisible.
export class FloatMenuService { 
  
  // Señal: Estado de visibilidad del menú desplegable.
  isMenuOpen = signal<boolean>(false);

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
