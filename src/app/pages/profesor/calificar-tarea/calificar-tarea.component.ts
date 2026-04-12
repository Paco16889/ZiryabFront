import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask } from '../../../core/models/studentTask';

@Component({
  selector: 'app-calificar-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './calificar-tarea.component.html',
  styleUrls: ['./calificar-tarea.component.scss']
})
export class CalificarTareaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private fb = inject(FormBuilder);

  taskDelivery: StudentTask | null = null;
  loading = true;
  error = '';
  submitting = false;

  gradeForm: FormGroup = this.fb.group({
    score: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
    feedback: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudentTask(Number(id));
    } else {
      this.error = 'No se ha proporcionado un ID de entrega válido';
      this.loading = false;
    }
  }

  loadStudentTask(id: number): void {
    this.studentTaskService.getStudentTaskById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.taskDelivery = response.data;
          // Set form values if it's already graded
          if (this.taskDelivery.status === 'GRADED') {
            this.gradeForm.patchValue({
              score: this.taskDelivery.score,
              feedback: this.taskDelivery.feedback
            });
          }
        } else {
          this.error = 'No se pudo cargar la entrega';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión al cargar la entrega';
        this.loading = false;
        console.error(err);
      }
    });
  }

  submitGrade(): void {
    if (this.gradeForm.invalid || !this.taskDelivery) {
      this.gradeForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const { score, feedback } = this.gradeForm.value;

    this.studentTaskService.gradeStudentTask(this.taskDelivery.id, { score, feedback }).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          // Navigating back
          window.history.back();
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al calificar la entrega. Por favor, inténtalo de nuevo.';
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
