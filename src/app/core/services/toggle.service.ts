import { Injectable, signal } from '@angular/core';

/**
 * Servicio encargado de gestionar el estado del menú lateral de navegación.
 * Controla qué sección del menú está activa en cada momento, permitiendo
 * alternar entre las distintas vistas del panel de administración.
 */
@Injectable({
  providedIn: 'root'
})
export class ToggleService {

   /**
   * Signal que almacena el nombre de la sección del menú actualmente abierta.
   * Si ninguna sección está activa su valor es null.
   */
  openedMenu = signal<string | null>(null);
  
  /**
   * Alterna la sección activa del menú lateral.
   * Si la sección indicada ya está abierta la cierra, si no la abre
   * cerrando cualquier otra que estuviera activa.
   * @param menu - Nombre identificador de la sección del menú a alternar
   * @example
   * this.toggleService.toggle('students');
   * // Si students estaba cerrado lo abre, si estaba abierto lo cierra
   */
  toggle(menu: string){
    if (this.openedMenu() === menu) {
      this.openedMenu.set(null);
    } else{
      this.openedMenu.set(menu);
    }
    
  }
}
