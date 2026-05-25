import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { EnrollmentStatus } from '../../../core/models/enrollment';
import { TranslateService } from '@ngx-translate/core';

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
  private translate = inject(TranslateService);
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
      case EnrollmentStatus.ENROLLED: return this.translate.instant('teacherPages.attendance.status.present');
      case EnrollmentStatus.EVALUATION_LOST: return this.translate.instant('teacherPages.attendance.status.absent');
      case EnrollmentStatus.WITHDRAWN: return this.translate.instant('teacherPages.attendance.status.excused');
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
