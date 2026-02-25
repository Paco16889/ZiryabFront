import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Componente que permite seleccionar el tipo de matriculación.
 * Muestra dos opciones mediante botones de radio: alumno nuevo o alumno existente.
 */
@Component({
  selector: 'app-student-mode-selector',
  imports: [],
  templateUrl: './student-mode-selector.component.html',
  styleUrl: './student-mode-selector.component.scss'
})
export class StudentModeSelectorComponent {
   /**
   * Evento emitido cuando el usuario selecciona un tipo de matriculación.
   * Emite 'new' para alumno nuevo o 'existing' para alumno existente.
   */
  @Output() modeSelected = new EventEmitter<'new' | 'existing'>();

    /**
   * Emite el modo de matriculación seleccionado al componente padre.
   * @param mode - Tipo de matriculación seleccionado: 'new' o 'existing'
   */
  setMode(mode: 'new' | 'existing') {
    this.modeSelected.emit(mode);
  }
}
