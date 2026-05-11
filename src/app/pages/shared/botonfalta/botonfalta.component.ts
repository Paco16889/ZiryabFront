import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnrollmentStatus } from '../../../core/models/enrollment';

/**
 * Componente que representa un botón de estado de asistencia para el listado del profesor.
 * Permite marcar a un alumno como presente, ausente o justificado.
 */
@Component({
  selector: 'app-botonfalta',
  imports: [],
  templateUrl: './botonfalta.component.html',
  styleUrl: './botonfalta.component.scss'
})
export class BotonfaltaComponent {
  /** El tipo de estado que representa este botón */
  @Input() statusType!: EnrollmentStatus;
  /** Indica si este botón es el estado actualmente seleccionado para el alumno */
  @Input() isActive: boolean = false;
  /** Emite el nuevo estado cuando el profesor pulsa el botón */
  @Output() statusSelected = new EventEmitter<EnrollmentStatus>();

  /**
   * Obtiene la etiqueta textual legible para el estado del botón.
   */
  get label(): string {
    switch (this.statusType) {
      case EnrollmentStatus.ENROLLED: return 'Presente';
      case EnrollmentStatus.EVALUATION_LOST: return 'Falta';
      case EnrollmentStatus.WITHDRAWN: return 'Justificada';
      default: return '';
    }
  }

  /**
   * Obtiene las clases de CSS dinámicas según si el botón está activo y su tipo de estado.
   */
  get colorClasses(): string {
    if (!this.isActive) return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    switch (this.statusType) {
      case EnrollmentStatus.ENROLLED: return 'bg-green-500 text-white';
      case EnrollmentStatus.EVALUATION_LOST: return 'bg-red-500 text-white';
      case EnrollmentStatus.WITHDRAWN: return 'bg-yellow-400 text-white';
      default: return '';
    }
  }

  /**
   * Notifica el cambio de estado al pulsar el botón.
   */
  onClick(): void {
    this.statusSelected.emit(this.statusType);
  }
}
