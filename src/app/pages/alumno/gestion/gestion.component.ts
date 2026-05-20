import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra el menú de gestión académica del estudiante.
 * Presenta las opciones de navegación disponibles: ficha de usuario,
 * horario, calendario y tablón de anuncios.
 * ATENCIÓN: las rutas calendario y tablon-anuncio no están implementadas.
 * ATENCIÓN: candidato a simplificarse extrayendo las opciones a un array de configuración.
 */
@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, TranslateModule],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent {
  
    /**
   * @param router - Router de Angular para gestionar las navegaciones.
   * ATENCIÓN: debería usarse NavigationService para ser consistente con el resto del proyecto.
   */
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
    /**
   * Navega a la ruta indicada.
   * 
   * @param route - Nombre de la ruta a la que navegar
   */
  goToComponent(route: string) {
    if (route === 'ficha-usuario') {
        const userRole = this.authService.getUserRole();
        const targetRoute = userRole === 'TEACHER' ? '/ficha-profesor' : '/ficha-usuario';
        this.router.navigate([targetRoute]); 
    } else if (route === 'horario') {
        const userRole = this.authService.getUserRole();
        const targetRoute = userRole === 'TEACHER' ? '/horario-profesor' : '/horario-alumno';
        this.router.navigate([targetRoute]);
    } else if (route === 'evaluaciones') {
        const userRole = this.authService.getUserRole();
        const targetRoute = userRole === 'TEACHER' ? '/evaluaciones' : '/mis-evaluaciones';
        this.router.navigate([targetRoute]);
    } else {
        this.router.navigate([`/${route}`]);
    }
  }
}