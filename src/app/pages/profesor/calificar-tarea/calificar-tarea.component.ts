import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../core/i18n/api-error.util';
import { StudentTaskService } from '../../../core/services/alumno/student-task.service';
import { StudentTask } from '../../../core/models/studentTask';

/**
 * Componente que permite al profesor calificar la entrega de una tarea.
 * Proporciona un formulario reactivo para emitir una nota (0-10) y feedback.
 */
@Component({
  selector: 'app-calificar-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './calificar-tarea.component.html',
  styleUrls: ['./calificar-tarea.component.scss']
})
export class CalificarTareaComponent implements OnInit {
  /** Ruta activa para leer el id de la entrega. */
  private route = inject(ActivatedRoute);
  /** Router reservado para navegación de la vista. */
  private router = inject(Router);
  /** Servicio de entregas para cargar y calificar. */
  private studentTaskService = inject(StudentTaskService);
  /** Constructor del formulario de calificación. */
  private fb = inject(FormBuilder);
  /** Traducciones de errores. */
  private readonly translate = inject(TranslateService);

  /** Entrega que se está calificando. */
  taskDelivery: StudentTask | null = null;
  /** Estado de carga inicial. */
  loading = true;
  /** Mensaje de error visible. */
  error = '';
  /** Estado de envío de la nota. */
  submitting = false;

  /** Formulario de nota y feedback con rango permitido 0-10. */
  gradeForm: FormGroup = this.fb.group({
    score: [null, [Validators.required, Validators.min(0), Validators.max(10)]],
    feedback: ['']
  });

  /** Lee el id de ruta y carga la entrega. */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudentTask(Number(id));
    } else {
      this.error = this.translate.instant('teacherPages.gradeDelivery.errorInvalidId');
      this.loading = false;
    }
  }

  /**
   * Carga los datos de la entrega especificada por ID para inicializar la vista.
   * Si ya ha sido evaluada, rellena el formulario con los datos preexistentes.
   * @param id Identificador único de la entrega.
   */
  loadStudentTask(id: number): void {
    this.studentTaskService.getStudentTaskById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const taskDelivery = response.data;
          this.taskDelivery = taskDelivery;
          // Set form values if it's already graded
          if (taskDelivery.status === 'GRADED') {
            this.gradeForm.patchValue({
              score: taskDelivery.score,
              feedback: taskDelivery.feedback
            });
          }
        } else {
          this.error = this.translate.instant('teacherPages.gradeDelivery.errorLoad');
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = resolveApiError(this.translate, err, 'common.errors.connection');
        this.loading = false;
        console.error(err);
      }
    });
  }

  /**
   * Envía la evaluación al backend cuando el formulario es válido.
   * Tras la correcta comunicación, redirige a la vista anterior.
   */
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
        this.error = resolveApiError(this.translate, err, 'submissions.gradeError');
        this.submitting = false;
      }
    });
  }

  /**
   * Regresa a la vista anterior en el historial de navegación.
   */
  goBack(): void {
    window.history.back();
  }
}
