import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask, SubmissionStatus } from '../../../core/models/studentTask';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-student-task-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BotonAtrasComponent],
  templateUrl: './student-task-detail.component.html',
  styleUrls: ['./student-task-detail.component.scss']
})
export class StudentTaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentTaskService = inject(StudentTaskService);
  private fb = inject(FormBuilder);

  task = signal<StudentTask | null>(null);
  loading = signal<boolean>(true);
  submitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  submitForm: FormGroup;
  isPastDueDate = signal<boolean>(false);

  SubmissionStatus = SubmissionStatus;

  constructor() {
    this.submitForm = this.fb.group({
      attachmentUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.loadTask(parseInt(idParam, 10));
    } else {
      this.errorMessage.set('ID de tarea no proporcionado.');
      this.loading.set(false);
    }
  }

  loadTask(id: number): void {
    this.studentTaskService.getStudentTaskById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.task.set(res.data);
          this.checkDueDate(res.data);
        } else {
          this.errorMessage.set('No se pudo cargar la tarea.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar la tarea detallada.');
        this.loading.set(false);
      }
    });
  }

  checkDueDate(studentTask: StudentTask): void {
    const dueDate = new Date(studentTask.task.dueDate);
    const now = new Date();
    this.isPastDueDate.set(now > dueDate);

    if (studentTask.status !== SubmissionStatus.PENDING) {
      this.submitForm.disable(); // Ya entregada
    } else if (this.isPastDueDate()) {
      this.submitForm.disable(); // Pasado el tiempo (será evaluado tarde o bloqueado según lo decidas)
      // Opcional: Permitir entregas LATE si dejamos activado el formulario
      this.submitForm.enable(); 
    }
  }

  onSubmit(): void {
    if (this.submitForm.invalid) return;

    const t = this.task();
    if (!t) return;

    this.submitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValue = this.submitForm.value;

    this.studentTaskService.submitStudentTask(t.id, { attachmentUrl: formValue.attachmentUrl }).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage.set('Tarea entregada con éxito.');
          this.task.set(res.data);
          this.submitForm.disable();
        }
        this.submitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al entregar la tarea.');
        this.submitting.set(false);
      }
    });
  }
}
