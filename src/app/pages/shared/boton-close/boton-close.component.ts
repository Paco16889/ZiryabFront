import { Component } from '@angular/core';

/**
 * Componente compartido que representa un botón de cierre genérico.
 * Actualmente sin uso en el proyecto, pendiente de integrar donde se necesite
 * una acción de cierre como modales o paneles.
 */
@Component({
  selector: 'app-boton-close',
  imports: [],
  templateUrl: './boton-close.component.html',
  styleUrl: './boton-close.component.scss'
})
export class BotonCloseComponent {

 /**
   * Maneja el clic sobre el botón de cierre.
   * Pendiente de implementar la lógica de cierre o emitir un evento al componente padre.
   */
  onClick(){
    console.log('clic en boton close');
  }
}
