import { Component, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';

/**
 * Shell del datagrid de asignaciones (CURSO-98 ampliará el grid).
 * Recibe el contexto del wizard (CURSO-97).
 */
@Component({
  selector: 'app-course-assignments-grid',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './course-assignments-grid.component.html',
  styleUrl: './course-assignments-grid.component.scss',
})
export class CourseAssignmentsGridComponent {
  readonly context = input.required<CourseAssignmentsContext>();

  readonly back = output<void>();

  gradeDisplay(): string {
    const grade = this.context().grade.trim();
    if (/^\d+$/.test(grade)) {
      return `${grade}º`;
    }
    return grade;
  }

  onBack(): void {
    this.back.emit();
  }
}
