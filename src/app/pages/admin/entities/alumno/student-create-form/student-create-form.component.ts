import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss',
})
export class StudentCreateFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly studentService = inject(StudentsService);
  private readonly selectedStudentService = inject(SelectedStudentService);

  @Output() studentCreated = new EventEmitter<void>();
  @Output() cancelCreate = new EventEmitter<void>();

  createForm: FormGroup;
  errorMessage = '';
  public validForm = false;

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

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
