import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { Subject } from '../../../../../core/models/subject';
import { BotonConfirmarStudentComponent } from '../../../botones/boton-confirmar-student/boton-confirmar-student.component';
import { Student } from '../../../../../core/models/student';
import {
  EnrollmentConfirmErrorCode,
  StudentRegistrationService,
} from '../../../../../core/services/admin/student-registration.service';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { normalizeGradeValue } from '../../../../../core/utils/week-schedule-assignment-filters';

@Component({
  selector: 'app-set-registration',
  imports: [FormsModule, BotonConfirmarStudentComponent, TranslateModule],
  templateUrl: './set-registration.component.html',
  styleUrl: './set-registration.component.scss',
})
export class SetRegistrationComponent {
  private readonly courseService = inject(CourseService);
  private readonly groupService = inject(GroupService);
  private readonly subjectService = inject(SubjectService);
  private readonly studentRegService = inject(StudentRegistrationService);
  private readonly translate = inject(TranslateService);
  readonly studentSelectedService = inject(SelectedStudentService);

  readonly courses = this.courseService.courses;
  readonly groups = this.groupService.groups;

  selectedCicloId: number | null = null;
  selectedGroupId: number | null = null;
  asignaturasPorCiclo: Subject[] | null = null;
  selectedSubjects: Subject[] = [];
  /** Oferta completa activa (solo un grade a la vez); null = selección suelta. */
  activeFullOfferGrade: string | null = null;

  enrollmentTargetLabel = '';
  readonly isSaving = signal(false);
  readonly saveError = signal<string | null>(null);

  @Input() students: Student[] = [];
  @Output() closeForm = new EventEmitter<void>();

  ngOnInit(): void {
    this.courseService.loadCourses();
    this.groupService.loadGroups();
    this.subjectService.loadSubjects();
    this.enrollmentTargetLabel = this.studentSelectedService.enrollmentTargetLabel();
  }

  private resetSubjectSelection(): void {
    this.selectedSubjects = [];
    this.activeFullOfferGrade = null;
  }

  eligeCiclo(): void {
    this.selectedGroupId = null;
    this.asignaturasPorCiclo = null;
    this.resetSubjectSelection();
  }

  eligeGrupo(): void {
    if (this.selectedCicloId == null || this.selectedGroupId == null) {
      this.asignaturasPorCiclo = null;
      this.resetSubjectSelection();
      return;
    }

    this.asignaturasPorCiclo = this.subjectService.loadByCourse(this.selectedCicloId);
    this.resetSubjectSelection();
  }

  availableFullOfferGrades(): string[] {
    const grades = new Set<string>();
    for (const subject of this.asignaturasPorCiclo ?? []) {
      grades.add(normalizeGradeValue(subject.grade));
    }
    return [...grades].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  private subjectsForGrade(grade: string): Subject[] {
    const gradeNorm = normalizeGradeValue(grade);
    return (this.asignaturasPorCiclo ?? []).filter(
      (subject) => normalizeGradeValue(subject.grade) === gradeNorm,
    );
  }

  isFullOfferSelected(grade: string): boolean {
    return this.activeFullOfferGrade === normalizeGradeValue(grade);
  }

  toggleFullOffer(grade: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const gradeNorm = normalizeGradeValue(grade);

    if (input.checked) {
      this.activeFullOfferGrade = gradeNorm;
      this.selectedSubjects = [...this.subjectsForGrade(gradeNorm)];
      return;
    }

    if (this.activeFullOfferGrade === gradeNorm) {
      this.resetSubjectSelection();
    }
  }

  isSubjectSelected(subject: Subject): boolean {
    return this.selectedSubjects.some((s) => s.id === subject.id);
  }

  onToggleSubject(subject: Subject, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (this.activeFullOfferGrade !== null) {
      this.activeFullOfferGrade = null;
      this.selectedSubjects = [];
    }

    if (input.checked) {
      this.selectedSubjects.push(subject);
    } else {
      this.selectedSubjects = this.selectedSubjects.filter((s) => s.id !== subject.id);
    }
  }

  /** EQ-313: cerrar wizard solo tras respuesta OK; mantener UI bloqueada mientras guarda. */
  onConfirmRegistration(): void {
    if (this.isSaving() || this.selectedGroupId == null) {
      return;
    }

    this.saveError.set(null);
    this.subjectService.setSelectedSubjects(this.selectedSubjects);

    this.isSaving.set(true);
    this.studentSelectedService.enrollmentInProgress.set(true);

    this.studentRegService.confirmEnrollment(this.selectedGroupId).subscribe({
      next: () => {
        this.finishSaving();
        this.closeForm.emit();
      },
      error: (err: unknown) => {
        this.finishSaving();
        this.saveError.set(this.resolveSaveErrorMessage(err));
      },
    });
  }

  private finishSaving(): void {
    this.isSaving.set(false);
    this.studentSelectedService.enrollmentInProgress.set(false);
  }

  private resolveSaveErrorMessage(err: unknown): string {
    const code =
      err instanceof Error ? (err.message as EnrollmentConfirmErrorCode) : 'REGISTRATION_FAILED';

    if (code === 'STUDENT_CREATE_FAILED') {
      return this.translate.instant('studentEnrollment.setRegistration.saveErrorStudent');
    }
    if (code === 'NO_SUBJECTS' || code === 'NO_STUDENT') {
      return this.translate.instant('studentEnrollment.setRegistration.saveErrorGeneric');
    }
    return this.translate.instant('studentEnrollment.setRegistration.saveErrorRegistration');
  }
}
