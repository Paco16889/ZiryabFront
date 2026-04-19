import { Component, Input } from '@angular/core';
import { StudentTask, SubmissionStatus } from '../../../../core/models/studentTask';
import { DatePipe, NgClass } from '@angular/common';


/**
 * Componente que representa una tarea individual del alumno.
 * Muestra título, fechas, estado y nota si la hay.
 */
@Component({
  selector: 'app-student-task-list-item',
  imports: [ NgClass, DatePipe],
  templateUrl: './student-task-list-item.component.html',
  styleUrl: './student-task-list-item.component.scss'
})
export class StudentTaskListItemComponent {
  /** Entrega del alumno con todos sus datos y la tarea asociada */
  @Input() studentTask!: StudentTask;

  /**
   * Devuelve la etiqueta legible del estado de la entrega.
   */
  statusLabel(): string {
    const labels: Record<SubmissionStatus, string> = {
      [SubmissionStatus.PENDING]:       'Pendiente',
      [SubmissionStatus.SUBMITTED]:     'Entregada',
      [SubmissionStatus.LATE]:          'Entregada tarde',
      [SubmissionStatus.GRADED]:        'Calificada',
      [SubmissionStatus.NOT_SUBMITTED]: 'No entregada',
    };
    return labels[this.studentTask.status];
  }
}
