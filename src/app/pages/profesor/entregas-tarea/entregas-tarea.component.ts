import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { TaskService } from '../../../core/services/task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-entregas-tarea',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entregas-tarea.component.html',
  styleUrls: ['./entregas-tarea.component.scss']
})
export class EntregasTareaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private taskService = inject(TaskService);

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
      this.error.set('No se proporcionó un ID de tarea válido.');
      this.loading.set(false);
    }
  }

  loadTaskHeader() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (res) => {
        if (res.success) this.taskDetails.set(res.data);
      },
      error: (err) => console.error(err)
    });
  }

  isPastDue(): boolean {
    const td = this.taskDetails();
    if (!td || !td.dueDate) return false;
    return new Date(td.dueDate).getTime() < this.today.getTime();
  }

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
          this.error.set('No se pudieron cargar las entregas');
        }
        this.loading.set(false);
      },
      error: (err) => {
         this.error.set('Hubo un error al descargar el listado de entregas');
         this.loading.set(false);
         console.error(err);
      }
    });
  }

  goBack() {
    window.history.back();
  }
}
