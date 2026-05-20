import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Course } from '../../../../../core/models/course';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';

type WizardStep = 1 | 2;

/**
 * Wizard ciclo → grade para crear asignaciones docentes (CURSO-97).
 */
@Component({
  selector: 'app-course-assignments-wizard',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './course-assignments-wizard.component.html',
  styleUrl: './course-assignments-wizard.component.scss',
})
export class CourseAssignmentsWizardComponent implements OnInit {
  private readonly assignmentsService = inject(AssignmentsService);

  readonly courses = input.required<Course[]>();

  readonly cancel = output<void>();
  readonly completed = output<CourseAssignmentsContext>();

  readonly step = signal<WizardStep>(1);
  readonly selectedCourseId = signal<number | null>(null);
  readonly selectedGrade = signal<string | null>(null);
  readonly grades = signal<string[]>([]);
  readonly loadingGrades = signal(false);
  readonly gradesError = signal(false);
  readonly showValidation = signal(false);

  ngOnInit(): void {
    if (this.courses().length === 1) {
      this.selectCourse(this.courses()[0].id);
    }
  }

  selectedCourseName(): string {
    const id = this.selectedCourseId();
    if (id == null) {
      return '';
    }
    return this.courses().find((c) => c.id === id)?.name ?? '';
  }

  onBack(): void {
    if (this.step() === 2) {
      this.step.set(1);
      this.selectedGrade.set(null);
      this.showValidation.set(false);
      return;
    }
    this.cancel.emit();
  }

  selectCourse(idCourse: number): void {
    if (!idCourse || Number.isNaN(idCourse)) {
      this.selectedCourseId.set(null);
      this.grades.set([]);
      return;
    }
    this.selectedCourseId.set(idCourse);
    this.selectedGrade.set(null);
    this.grades.set([]);
    this.gradesError.set(false);
    this.showValidation.set(false);
    this.loadingGrades.set(true);

    this.assignmentsService.getGradesByCourse(idCourse).subscribe((res) => {
      this.loadingGrades.set(false);
      if (!res.success || res.data.length === 0) {
        this.gradesError.set(true);
        this.grades.set([]);
        return;
      }
      this.grades.set(res.data);
    });
  }

  goToGradeStep(): void {
    if (this.selectedCourseId() == null) {
      this.showValidation.set(true);
      return;
    }
    if (this.grades().length === 0 && !this.loadingGrades()) {
      this.gradesError.set(true);
      return;
    }
    this.step.set(2);
    this.showValidation.set(false);
  }

  selectGrade(grade: string): void {
    this.selectedGrade.set(grade);
    this.showValidation.set(false);
  }

  confirmGrade(): void {
    const idCourse = this.selectedCourseId();
    const grade = this.selectedGrade();
    if (idCourse == null || !grade) {
      this.showValidation.set(true);
      return;
    }
    this.completed.emit({
      idCourse,
      courseName: this.selectedCourseName(),
      grade,
    });
  }

  gradeLabel(grade: string): string {
    const normalized = grade.trim();
    if (/^\d+$/.test(normalized)) {
      return `${normalized}º`;
    }
    return grade;
  }
}
