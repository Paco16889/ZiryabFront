import { Component, EventEmitter, Input, OnDestroy, Output, inject } from '@angular/core';
import { StudentCreateFormComponent } from '../student-create-form/student-create-form.component';
import { StudentSelectorComponent } from '../student-selector/student-selector.component';
import { Student } from '../../../../../core/models/student';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { SetRegistrationComponent } from '../set-registration/set-registration.component';
import { StudentModeSelectorComponent } from '../student-mode-selector/student-mode-selector.component';
import { TranslateModule } from '@ngx-translate/core';

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
  readonly selectedStudentService = inject(SelectedStudentService);
  private readonly subjectService = inject(SubjectService);

  @Input() students: Student[] = [];
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() studentCreated = new EventEmitter<void>();

  mode: 'new' | 'existing' | 'set-registration' = 'new';

  private sessionClosed = false;

  ngOnDestroy(): void {
    if (!this.sessionClosed) {
      this.selectedStudentService.clearSelectedStudent();
    }
  }

  setMode(mode: 'new' | 'existing' | 'set-registration'): void {
    this.mode = mode;
  }

  onCancel(): void {
    this.closeSession();
    this.cancelCreate.emit();
  }

  onCancelStudentCreate(): void {
    this.onCancel();
  }

  onStudentSelected(student: Student): void {
    this.selectedStudentService.setSelectedStudent(student);
    this.setMode('set-registration');
  }

  onStudentCreated(): void {
    this.setMode('set-registration');
  }

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
