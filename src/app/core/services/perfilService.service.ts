import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PerfilMenuService { 
  
  public isMenuOpen = signal<boolean>(false);

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