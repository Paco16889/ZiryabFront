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
    if (str === 'clases') {
        const user = this.authService.user();
        
        if (user && user.role === 'TEACHER') {
            this.navegador.toComponent('clases-profesor');
            return;  
        }
    }
    this.navegador.toComponent(str);
  }
}