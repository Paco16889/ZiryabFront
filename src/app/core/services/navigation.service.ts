import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Servicio encargado de centralizar la navegación entre componentes de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  /**
   * Instancia del router de Angular para gestionar las navegaciones.
   */
  private router: Router = inject(Router);


  constructor() { }

    /**
   * Navega a la ruta correspondiente al nombre del componente indicado.
   * @param componentName - Nombre de la ruta a la que navegar
   * @example
   * this.navigationService.toComponent('students');
   * // Navega a /students
   */
    toComponent(componentName:string){
    
    this.router.navigate([`/${componentName}`]);
  }
}
