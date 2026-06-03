import { Component, Input } from '@angular/core';
import { Student } from '../../../core/models/student';
import { EnrollmentStatus } from '../../../core/models/enrollment';
import { BotonfaltaComponent } from '../../shared/botonfalta/botonfalta.component';

/** Tarjeta de alumno para seleccionar su estado de asistencia/matrícula. */
@Component({
  selector: 'app-tarjetaasistencia',
  imports: [ BotonfaltaComponent],
  templateUrl: './tarjetaasistencia.component.html',
  styleUrl: './tarjetaasistencia.component.scss'
})
export class TarjetaasistenciaComponent {
  /** Alumno mostrado en la tarjeta. */
  @Input() student!: Student;

  /** Estado seleccionado localmente en la tarjeta. */
  selectedStatus: EnrollmentStatus | null = null;

  /** Estados disponibles en el selector de asistencia. */
  readonly statusOptions = [
    EnrollmentStatus.ENROLLED,
    EnrollmentStatus.EVALUATION_LOST,
    EnrollmentStatus.WITHDRAWN
  ];

  /** Actualiza el estado seleccionado al pulsar una opción. */
  onStatusSelected(status: EnrollmentStatus): void {
    this.selectedStatus = status;
  }
}
