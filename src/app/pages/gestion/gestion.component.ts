import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para el evento (click)
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion',
  imports: [],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent {
    constructor(private router: Router) {}
  
  /**
   * Navega a la ruta especificada.
   * @param route La ruta de destino (ej: 'ficha-usuario', 'horario')
   */
  goToComponent(route: string) {
    this.router.navigate([`/${route}`]); 
  }
}
