import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BotonConfirmarStudentComponent } from '../../../botones/boton-confirmar-student/boton-confirmar-student.component';
import { DNI_NIE_PATTERN } from '../../../../../core/configs/validators';
import { PendingStudentDraft } from '../../../../../core/models/student';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';

/**
 * Paso 2 del wizard: valida y guarda borrador en memoria (EQ-311-A).
 * Firebase y POST /students se ejecutan al confirmar matrículas en el paso 3.
 */
@Component({
  selector: 'app-student-create-form',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent, TranslateModule],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss',
})
export class StudentCreateFormComponent {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);

  /** Comprueba DNI duplicado en listado local. */
  private readonly studentService = inject(StudentsService);

  /** Guarda el borrador en memoria del wizard. */
  private readonly selectedStudentService = inject(SelectedStudentService);

  /** Avanza al paso 3 tras guardar el borrador en memoria. */
  @Output() studentCreated = new EventEmitter<void>();

  /** Cancela el wizard de matriculación. */
  @Output() cancelCreate = new EventEmitter<void>();

  /** Formulario reactivo con datos personales del alumno. */
  createForm: FormGroup;

  /** Mensaje de validación o DNI duplicado. */
  errorMessage = '';

  /** Indica si el formulario cumple validaciones (uso en plantilla). */
  public validForm = false;

  /** Construye el formulario con validadores de email y DNI/NIE. */
  constructor() {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(DNI_NIE_PATTERN)]],
    });
  }

  /** Valida, comprueba DNI y guarda borrador sin llamar al API de alumnos. */
  onSubmit(): void {
    if (this.createForm.invalid) {
      return;
    }

    const formValue = this.createForm.value;
    const dni = formValue.dni as string;

    const exists = this.studentService.students().some((student) => student.dni === dni);
    if (exists) {
      this.errorMessage = 'Estudiante existente. Matricular desde estudiante existente.';
      return;
    }

    const draft: PendingStudentDraft = {
      email: formValue.email,
      name: formValue.name,
      surname: formValue.surname,
      ndSurname: formValue.ndSurname,
      birthDate: formValue.birthDate,
      dni: formValue.dni,
    };

    this.selectedStudentService.setPendingStudentDraft(draft);
    this.errorMessage = '';
    this.studentCreated.emit();
  }

  /** Emite cancelación al contenedor del wizard. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
