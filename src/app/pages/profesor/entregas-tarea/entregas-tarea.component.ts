import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { TaskService } from '../../../core/services/task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { Task } from '../../../core/models/task';

/**
 * Componente para mostrar las entregas correspondientes a una tarea específica.
 * Permite al profesor visualizar una lista de todos los estudiantes y su estado de entrega,
 * con la finalidad de acceder a la revisión o calificación individual.
 */
@Component({
  selector: 'app-entregas-tarea',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './entregas-tarea.component.html',
  styleUrls: ['./entregas-tarea.component.scss']
})
export class EntregasTareaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private taskService = inject(TaskService);
  private readonly translate = inject(TranslateService);

  taskId = Number(this.route.snapshot.paramMap.get('taskId'));
  taskDetails = signal<Task | null>(null);
  studentTasks = signal<StudentTask[]>([]);
  
  loading = signal(true);
  error = signal('');
  SubmissionStatus = SubmissionStatus;
  today = new Date();

  ngOnInit(): void {
    if (this.taskId) {
      this.loadTaskHeader();
      this.loadDeliveries();
    } else {
      this.error.set(this.translate.instant('common.errors.taskIdMissing'));
      this.loading.set(false);
    }
  }

  /**
   * Carga la información de la cabecera (título, descripción, etc.) de la tarea solicitada.
   */
  loadTaskHeader() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (res) => {
        if (res.success) this.taskDetails.set(res.data);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Comprueba si la fecha límite de la tarea ya ha superado la fecha y hora actuales.
   * @returns Verdadero si la tarea ya ha vencido, falso en caso contrario.
   */
  isPastDue(): boolean {
    const td = this.taskDetails();
    if (!td || !td.dueDate) return false;
    return new Date(td.dueDate).getTime() < this.today.getTime();
  }

  /**
   * Recupera el listado completo de entregas (StudentTask) asociadas a esta tarea.
   * Ordena los envíos priorizando las fechas de entrega más recientes.
   */
  loadDeliveries() {
    this.studentTaskService.getStudentTasksByTask(this.taskId).subscribe({
      next: (res) => {
        if (res.success) {
          const sorted = res.data.sort((a, b) => {
             return (b.submissionDate ? new Date(b.submissionDate).getTime() : 0) - 
                    (a.submissionDate ? new Date(a.submissionDate).getTime() : 0);
          });
          this.studentTasks.set(sorted);
        } else {
          this.error.set(this.translate.instant('common.errors.loadTaskDetail'));
        }
        this.loading.set(false);
      },
      error: (err) => {
         this.error.set(resolveApiError(this.translate, err, 'common.errors.connection'));
         this.loading.set(false);
         console.error(err);
      }
    });
  }

  /**
   * Regresa a la vista previa del temario usando la API nativa de historial.
   */
  goBack() {
    window.history.back();
  }
}
