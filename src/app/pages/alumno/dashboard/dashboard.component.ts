import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NavigationService } from '../../../core/services/navigation.service';
// 1. Importamos el servicio de autenticación para saber el rol
import { LocalStorageAuthService } from '../../../core/services/localstorage-auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private navegador = inject(NavigationService);
  private authService = inject(LocalStorageAuthService); // 2. Inyección

  goTo(str: string){
    // 3. Interceptamos si el usuario quiere ir a 'clases'
    if (str === 'clases') {
        const user = this.authService.user();
        
        // Si es profesor, lo redirigimos a SU ruta específica
        if (user && user.role === 'TEACHER') {
            this.navegador.toComponent('clases-profesor');
            return; // Salimos para no ejecutar la línea de abajo
        }
    }

    // Navegación normal para el resto de casos (o si es alumno)
    this.navegador.toComponent(str);
  }
}