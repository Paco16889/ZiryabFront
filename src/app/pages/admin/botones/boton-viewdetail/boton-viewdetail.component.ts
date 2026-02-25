import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente que representa el botón de vista de detalle de una entidad.
 * Al pulsarlo emite el identificador de la entidad al componente padre
 * para que gestione la apertura de la vista de detalle.
 */
@Component({
  selector: 'app-boton-viewdetail',
  imports: [],
  templateUrl: './boton-viewdetail.component.html',
  styleUrl: './boton-viewdetail.component.scss'
})
export class BotonViewdetailComponent {

  /**
   * Identificador único de la entidad cuyo detalle se quiere mostrar.
   */
  @Input() id!: number;

   /**
   * Evento emitido al pulsar el botón, incluye el identificador de la entidad.
   */
  @Output() showDetail = new EventEmitter<number>();

  /**
   * Emite el evento showDetail con el identificador de la entidad actual.
   */
  onClick() {
    console.log(`has apretado el boton de ver detalle del alumno con id ${this.id}`);
    this.showDetail.emit(this.id); 
  }
}
