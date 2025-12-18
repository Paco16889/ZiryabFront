import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NavigationService } from '../../../core/services/navigation.service';
import { AuthService } from '../../../core/services/auth.service'; // CAMBIO: Usar AuthService

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private navegador = inject(NavigationService);
  private authService = inject(AuthService); // CAMBIO: Usar AuthService

  goTo(str: string){
    // Interceptar si el usuario quiere ir a 'clases'
    if (str === 'clases') {
        const user = this.authService.getCurrentUser(); // CAMBIO: Método correcto
        
        // Si es profesor, redirigir a su ruta específica
        if (user && user.role === 'TEACHER') {
            this.navegador.toComponent('clases-profesor');
            return;
        }
    }

    // Navegación normal para el resto de casos
    this.navegador.toComponent(str);
  }
}