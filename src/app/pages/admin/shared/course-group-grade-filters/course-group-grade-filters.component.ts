import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  CourseFilterOption,
  GroupFilterOption,
} from '../../../../core/utils/assignment-filter-options.util';

/**
 * Filtros compartidos ciclo + grupo + curso (grade) para listas basadas en assignments.
 */
@Component({
  selector: 'app-course-group-grade-filters',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './course-group-grade-filters.component.html',
  styleUrl: './course-group-grade-filters.component.scss',
})
export class CourseGroupGradeFiltersComponent {
  readonly titleKey = input<string | null>(null);
  readonly courses = input.required<CourseFilterOption[]>();
  readonly groups = input.required<GroupFilterOption[]>();
  readonly grades = input.required<string[]>();

  readonly courseId = input<number | null>(null);
  readonly groupId = input<number | null>(null);
  readonly grade = input<string | null>(null);

  readonly showCourse = input(true);
  readonly showGroup = input(true);
  readonly showGrade = input(true);

  readonly courseIdChange = output<number | null>();
  readonly groupIdChange = output<number | null>();
  readonly gradeChange = output<string | null>();
  readonly cleared = output<void>();

  onCourseChange(value: number | null): void {
    this.courseIdChange.emit(value);
    this.groupIdChange.emit(null);
    this.gradeChange.emit(null);
  }

  onGroupChange(value: number | null): void {
    this.groupIdChange.emit(value);
  }

  onGradeChange(value: string | null): void {
    this.gradeChange.emit(value);
  }

  clear(): void {
    this.courseIdChange.emit(null);
    this.groupIdChange.emit(null);
    this.gradeChange.emit(null);
    this.cleared.emit();
  }
}
