import { Component } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente que se muestra cuando un usuario intenta acceder a un recurso
 * para el que no tiene los permisos necesarios.
 * Ofrece un botón para redirigir al usuario al dashboard principal.
 */
@Component({
    selector: 'app-unauthorized',
    template: `
    <div class="container text-center mt-5">
      <h1>❌ Acceso Denegado</h1>
      <p>No tienes permiso para acceder a este recurso.</p>
      <button (click)="goBack()" class="btn btn-primary">
        Volver al Dashboard
      </button>
    </div>
  `,
})
export class UnauthorizedComponent {

   /**
   * Inicializa el componente.
   * @param router - Router de Angular para redirigir al dashboard
   */
    constructor(private router: Router) { }

     /**
   * Redirige al dashboard principal del usuario.
   */
    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
