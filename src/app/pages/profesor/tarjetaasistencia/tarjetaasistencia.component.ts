import { Component, Input } from '@angular/core';
import { Student } from '../../../core/models/student';
import { EnrollmentStatus } from '../../../core/models/enrollment';
import { BotonfaltaComponent } from '../../shared/botonfalta/botonfalta.component';

@Component({
  selector: 'app-tarjetaasistencia',
  imports: [ BotonfaltaComponent],
  templateUrl: './tarjetaasistencia.component.html',
  styleUrl: './tarjetaasistencia.component.scss'
})
export class TarjetaasistenciaComponent {
  @Input() student!: Student;

  selectedStatus: EnrollmentStatus | null = null;

  readonly statusOptions = [
    EnrollmentStatus.ENROLLED,
    EnrollmentStatus.EVALUATION_LOST,
    EnrollmentStatus.WITHDRAWN
  ];

  onStatusSelected(status: EnrollmentStatus): void {
    this.selectedStatus = status;
  }
}
