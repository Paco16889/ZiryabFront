import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// 1. IMPORTAR EL BOTÓN (Subimos 3 niveles: gestion -> alumno -> pages -> app -> shared)
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-gestion',
  standalone: true,
  // 2. AÑADIRLO A LOS IMPORTS
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent {
  
  constructor(private router: Router) {}
  
  goToComponent(route: string) {
    if (route === 'ficha-usuario') {
        this.router.navigate(['/ficha-usuario']); 
    } else {
        this.router.navigate([`/${route}`]);
    }
  }
}