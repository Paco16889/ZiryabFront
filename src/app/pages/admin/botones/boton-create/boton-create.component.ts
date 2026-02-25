import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';


/**
 * Componente que representa un botón de creación genérico.
 * Emite un evento al ser pulsado para que el componente padre gestione la acción.
 */
@Component({
  selector: 'app-boton-create',
  imports: [],
  templateUrl: './boton-create.component.html',
  styleUrl: './boton-create.component.scss'
})
export class BotonCreateComponent {
  
   /**
   * Texto que se muestra en el botón, por defecto 'Crear'.
   */
  @Input() label: string = 'Crear';

  /**
   * Evento emitido cuando el usuario pulsa el botón.
   */
@Output() clickAction = new EventEmitter<void>();


 /**
   * Emite el evento clickAction al pulsar el botón.
   */
handleClick() {
  this.clickAction.emit();
}
}
