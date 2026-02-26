import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
