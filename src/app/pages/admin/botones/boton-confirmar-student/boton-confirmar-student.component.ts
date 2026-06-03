import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '../../../../core/models/student';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que representa el botón de confirmación de selección de estudiante.
 * Emite el evento confirm cuando se pulsa y no está deshabilitado.
 */
@Component({
  selector: 'app-boton-confirmar-student',
  imports: [TranslateModule],
  templateUrl: './boton-confirmar-student.component.html',
  styleUrl: './boton-confirmar-student.component.scss'
})
export class BotonConfirmarStudentComponent {

  /**
   * Si es true el botón queda deshabilitado y no emite eventos al pulsarlo.
   */
  @Input() disabled: boolean = false;

  /**
   * Evento emitido cuando el usuario pulsa el botón y este no está deshabilitado.
   */
  @Output() confirm = new EventEmitter<void>();

  
  
  
 /**
   * Emite el evento confirm si el botón no está deshabilitado.
   */
  confirmSelection() {
    if (!this.disabled) {
      
      this.confirm.emit();
    }
  }
}
