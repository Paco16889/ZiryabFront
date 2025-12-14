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
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/dashboard']);
    }
}
