import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { StudentCreateFormComponent } from '../student-create-form/student-create-form.component';
import { StudentSelectorComponent } from '../student-selector/student-selector.component';
import { Student } from '../../../../../core/models/student';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { SetRegistrationComponent } from '../set-registration/set-registration.component';
import { StudentModeSelectorComponent } from '../student-mode-selector/student-mode-selector.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Contenedor del wizard de matriculación: modo nuevo alumno, existente
 * o paso final de asignaturas (EQ-311).
 */
@Component({
  selector: 'app-student-enrollment',
  imports: [
    StudentCreateFormComponent,
    SetRegistrationComponent,
    StudentSelectorComponent,
    StudentModeSelectorComponent,
    TranslateModule,
  ],
  templateUrl: './student-enrollment.component.html',
  styleUrl: './student-enrollment.component.scss',
})
export class StudentEnrollmentComponent implements OnDestroy {
  /** Estado compartido del alumno/borrador en el wizard de matriculación. */
  readonly selectedStudentService = inject(SelectedStudentService);

  /** Limpia asignaturas seleccionadas al cancelar el wizard. */
  private readonly subjectService = inject(SubjectService);

  /** Alumnos disponibles para matricular existente. */
  @Input() students: Student[] = [];

  /** Cancela el wizard completo. */
  @Output() cancelCreate = new EventEmitter<void>();

  /** Matrícula confirmada con éxito. */
  @Output() studentCreated = new EventEmitter<void>();

  /**
   * Paso visible del wizard: alta de alumno, selector de existente
   * o matrícula de asignaturas (paso 3).
   */
  mode: 'new' | 'existing' | 'set-registration' = 'new';

  /** Evita limpiar estado dos veces al cerrar con éxito. */
  private sessionClosed = false;

  /** Limpia borrador/alumno si el usuario abandona sin confirmar. */
  ngOnDestroy(): void {
    if (!this.sessionClosed) {
      this.selectedStudentService.clearSelectedStudent();
    }
  }

  /** Cambia el subpaso del wizard. */
  setMode(mode: 'new' | 'existing' | 'set-registration'): void {
    this.mode = mode;
  }

  /** Cancela y limpia sesión de matriculación. */
  onCancel(): void {
    this.closeSession();
    this.cancelCreate.emit();
  }

  /** Alias de cancelación desde el formulario de alta. */
  onCancelStudentCreate(): void {
    this.onCancel();
  }

  /** Alumno existente elegido: pasa al paso de asignaturas. */
  onStudentSelected(student: Student): void {
    this.selectedStudentService.setSelectedStudent(student);
    this.setMode('set-registration');
  }

  /** Borrador creado: pasa al paso de asignaturas. */
  onStudentCreated(): void {
    this.setMode('set-registration');
  }

  /** Matrícula OK: limpia estado y notifica al padre. */
  onRegistrationFinished(): void {
    this.sessionClosed = true;
    this.selectedStudentService.completeEnrollmentSession();
    this.studentCreated.emit();
  }

  /** Cancelar: solo limpia memoria (A). Huérfanos en BD → job backend (C). */
  private closeSession(): void {
    if (this.sessionClosed) {
      return;
    }
    this.sessionClosed = true;
    this.selectedStudentService.clearSelectedStudent();
    this.selectedStudentService.enrollmentInProgress.set(false);
    this.subjectService.clearSelectedSubjects();
    this.mode = 'new';
  }
}
