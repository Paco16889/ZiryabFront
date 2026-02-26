import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el menú de gestión académica del estudiante.
 * Presenta las opciones de navegación disponibles: ficha de usuario,
 * horario, calendario y tablón de anuncios.
 * ATENCIÓN: las rutas horario, calendario y tablon-anuncio no están implementadas.
 * ATENCIÓN: candidato a simplificarse extrayendo las opciones a un array de configuración.
 */
@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent {
  
    /**
   * @param router - Router de Angular para gestionar las navegaciones.
   * ATENCIÓN: debería usarse NavigationService para ser consistente con el resto del proyecto.
   */
  constructor(private router: Router) {}
  
    /**
   * Navega a la ruta indicada.
   * 
   * @param route - Nombre de la ruta a la que navegar
   */
  goToComponent(route: string) {
    if (route === 'ficha-usuario') {
        this.router.navigate(['/ficha-usuario']); 
    } else {
        this.router.navigate([`/${route}`]);
    }
  }
}