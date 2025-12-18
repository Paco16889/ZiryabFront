import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-gestion',
  standalone: true,
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