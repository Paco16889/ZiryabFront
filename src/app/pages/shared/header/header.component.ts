import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para funcionalidades básicas
// Importamos el servicio. La ruta sube 3 niveles (../../..) hasta 'app' y luego baja a 'core/services'
import { PerfilMenuService } from '../../../core/services/perfilService.service'; 

@Component({
  selector: 'app-header',
  standalone: true, // Debe ser standalone para importar módulos directamente
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  // 1. Inyectamos el servicio en el constructor para poder usarlo
  constructor(private perfilService: PerfilMenuService) {}

  // 2. Definimos la función que el HTML está intentando llamar al hacer click
  toggleProfileMenu(): void {
    console.log('Abriendo/Cerrando menú de perfil...');
    this.perfilService.toggleMenu(); // Llama a la lógica del servicio
  }
}