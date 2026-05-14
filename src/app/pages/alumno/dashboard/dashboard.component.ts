import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Componente principal del panel del estudiante.
 * Muestra las opciones de navegación disponibles y gestiona las redirecciones
 * según el rol del usuario autenticado.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  /** Servicio de navegación para gestionar las redirecciones entre vistas */
  private navegador = inject(NavigationService);

  /** Servicio de autenticación para obtener el usuario y su rol actual */
  private authService = inject(AuthService);

  /**
   * Navega a la sección indicada.
   * Si el usuario es profesor y selecciona 'clases' redirige a la vista específica de profesor.
   * @param str - Nombre de la ruta a la que navegar
   */
  goTo(str: string): void {
    const user = this.authService.getCurrentUser();

    if (str === 'clases') {
      if (user && user.role === 'TEACHER') {
        this.navegador.toComponent('clases-profesor');
        return;
      }
    }
    this.navegador.toComponent(str);
  }
}