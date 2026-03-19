import { Injectable, signal } from '@angular/core';

/**
 * Servicio encargado de gestionar el estado de visibilidad del menú de perfil.
 * A diferencia de FloatMenuService, este sí alterna correctamente el estado.
 */
@Injectable({
  providedIn: 'root'
})
export class PerfilMenuService { 
  
    /**
   * Signal que almacena el estado de visibilidad del menú de perfil.
   * true si el menú está abierto, false si está cerrado.
   */
  public isMenuOpen = signal<boolean>(false);

  /**
   * Inicializa el servicio sin dependencias externas.
   */
  constructor() { }

  /**
   * Abre o cierra el menú de perfil alternando el valor de la señal.
   */
  toggleMenu(): void {
    this.isMenuOpen.update(isOpen => !isOpen);
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