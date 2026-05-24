import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../../../core/services/profesor/task.service';
import { StudentTaskService } from '../../../../core/services/alumno/student-task.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentTaskStatus } from '../../../../core/models/teacher/tasks';
import { SubmissionStatus } from '../../../../core/models/studentTask';
import { DatePipe, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { StudentTask } from '../../../../core/models/teacher/tasks';


/**
 * Componente de detalle de tarea para el profesor.
 * Lee la tarea seleccionada desde la signal `selectedTask` del TaskService.
 * Muestra la info de la tarea, la lista de StudentTasks de los alumnos
 * y permite calificar cada entrega mediante un formulario reactivo.
 */
@Component({
  selector: 'app-task-detail',
  imports: [ NgClass, DatePipe, ReactiveFormsModule, TranslateModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent {
  /** Servicio de tareas del profesor; aporta la tarea seleccionada y su detalle. */
  taskService = inject(TaskService);
  /** Servicio de entregas de alumnos para calificar y actualizar StudentTasks. */
  studentTaskService = inject(StudentTaskService);
  /** Constructor de formularios para el panel de calificación. */
  private fb = inject(FormBuilder);

  /** StudentTask seleccionada para calificar, null si no hay ninguna abierta */
  selectedStudentTask = signal<StudentTask | null>(null);

  /** Formulario de calificación */
  gradeForm = this.fb.group({
    score:    [null as number | null, [Validators.required, Validators.min(0), Validators.max(10)]],
    feedback: ['']
  });

  /** Tarea activa desde la signal del servicio */
  task = computed(() => this.taskService.selectedTask());

  /** StudentTasks de la tarea activa */
  studentTasks = computed(() => this.task()?.studentTasks ?? []);

  /** Estadísticas rápidas */
  stats = computed(() => {
    const tasks = this.studentTasks();
    return {
      total:        tasks.length,
      submitted:    tasks.filter(st => st.status === SubmissionStatus.SUBMITTED || st.status === SubmissionStatus.LATE).length,
      graded:       tasks.filter(st => st.status === SubmissionStatus.GRADED).length,
      pending:      tasks.filter(st => st.status === SubmissionStatus.PENDING).length,
      notSubmitted: tasks.filter(st => st.status === SubmissionStatus.NOT_SUBMITTED).length,
    };
  });

  /**
   * Abre el formulario de calificación para una StudentTask concreta.
   */
  openGradeForm(studentTask: StudentTask): void {
    this.selectedStudentTask.set(studentTask);
    this.gradeForm.patchValue({
      score:    studentTask.score,
      feedback: studentTask.feedback ?? ''
    });
  }

  /**
   * Cierra el formulario de calificación.
   */
  closeGradeForm(): void {
    this.selectedStudentTask.set(null);
    this.gradeForm.reset();
  }

  /**
   * Envía la calificación al backend.
   */
  submitGrade(): void {
    if (this.gradeForm.invalid || !this.selectedStudentTask()) return;

    const { score, feedback } = this.gradeForm.value;
    const id = this.selectedStudentTask()!.id;

    this.studentTaskService.update(id, {
      score:    score ?? undefined,
      feedback: feedback ?? undefined,
      status:   SubmissionStatus.GRADED
    }).subscribe({
      next: res => {
        // Actualiza la signal de la tarea seleccionada refrescando el detalle
        const updated = this.taskService.selectedTask();
        if (updated) {
          const updatedStudentTasks = updated.studentTasks.map(st =>
            st.id === id ? res.data : st
          );
          this.taskService.selectedTask.set({
            ...updated,
            studentTasks: updatedStudentTasks
          });
        }
        this.closeGradeForm();
      },
      error: err => console.error('Error al calificar:', err)
    });
  }

  /**
   * Devuelve la etiqueta legible del estado.
   */
 statusLabel(status: StudentTaskStatus): string {
  const labels: Record<StudentTaskStatus, string> = {
    [SubmissionStatus.PENDING]:       'Pendiente',
    [SubmissionStatus.SUBMITTED]:     'Entregada',
    [SubmissionStatus.LATE]:          'Entregada tarde',
    [SubmissionStatus.GRADED]:        'Calificada',
    [SubmissionStatus.NOT_SUBMITTED]: 'No entregada',
  };
  return labels[status];
}
}
