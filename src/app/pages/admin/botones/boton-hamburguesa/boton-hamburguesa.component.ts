import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que representa el botón hamburguesa de navegación móvil.
 * Solo visible en dispositivos móviles, emite un evento al pulsarlo
 * para que el componente padre gestione la apertura del menú.
 */
@Component({
  selector: 'app-boton-hamburguesa',
  imports: [TranslateModule],
  templateUrl: './boton-hamburguesa.component.html',
  styleUrl: './boton-hamburguesa.component.scss'
})
export class BotonHamburguesaComponent {

  /**
   * Evento emitido cuando el usuario pulsa el botón hamburguesa.
   */
  @Output() menuToggled = new EventEmitter<void>();

  /**
   * Emite el evento menuToggled al pulsar el botón.
   */
  toggleMenu() {
    this.menuToggled.emit();
  }
  
}
