import { Component, Input, inject } from '@angular/core';
import { StudentTask, SubmissionStatus } from '../../../../core/models/studentTask';
import { DatePipe, NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


/**
 * Componente que representa una tarea individual del alumno.
 * Muestra título, fechas, estado y nota si la hay.
 */
@Component({
  selector: 'app-student-task-list-item',
  imports: [ NgClass, DatePipe, TranslateModule],
  templateUrl: './student-task-list-item.component.html',
  styleUrl: './student-task-list-item.component.scss'
})
export class StudentTaskListItemComponent {
  /** Traducciones de estados de entrega. */
  private translate = inject(TranslateService);
  /** Entrega del alumno con todos sus datos y la tarea asociada */
  @Input() studentTask!: StudentTask;

  /**
   * Devuelve la etiqueta legible del estado de la entrega.
   */
  statusLabel(): string {
    const keys: Record<SubmissionStatus, string> = {
      [SubmissionStatus.PENDING]:       'studentPages.tasks.status.pending',
      [SubmissionStatus.SUBMITTED]:     'studentPages.tasks.status.submitted',
      [SubmissionStatus.LATE]:          'studentPages.tasks.status.late',
      [SubmissionStatus.GRADED]:        'studentPages.tasks.status.graded',
      [SubmissionStatus.NOT_SUBMITTED]: 'studentPages.tasks.status.notSubmitted',
    };
    return this.translate.instant(keys[this.studentTask.status]);
  }
}
