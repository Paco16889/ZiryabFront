import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

/**
 * Componente compartido que representa el botón de navegación hacia atrás.
 * Usa el servicio Location de Angular para volver a la página anterior del historial.
 */
@Component({
  selector: 'app-boton-atras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-atras.component.html',
})
export class BotonAtrasComponent {
  
  /**
   * Servicio de Angular para gestionar la navegación en el historial del navegador.
   */
  private location = inject(Location);
  
    /**
   * Navega a la página anterior del historial del navegador.
   */
  goBack(): void {
    this.location.back();
  }
}