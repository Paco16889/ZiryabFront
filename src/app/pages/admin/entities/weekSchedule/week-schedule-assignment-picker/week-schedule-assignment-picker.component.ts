import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeacherSubjectAssignmentRow } from '../../../../../core/models/teacher/subjectforteacher';

/**
 * Desplegable reutilizable: assignments docente–asignatura para un mismo grupo/contexto.
 * @see CURSO-56
 */
@Component({
  selector: 'app-week-schedule-assignment-picker',
  standalone: true,
  imports: [FormsModule, TranslateModule],
  templateUrl: './week-schedule-assignment-picker.component.html',
  styleUrl: './week-schedule-assignment-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleAssignmentPickerComponent {
  private readonly translate = inject(TranslateService);

  /** Filas ya filtradas y sin duplicar por asignatura. */
  readonly options = input.required<TeacherSubjectAssignmentRow[]>();
  readonly teacherNameById = input.required<Map<number, string>>();
  /** `''` o id de assignment como string. */
  readonly selectedId = input<string>('');
  readonly selectId = input.required<string>();
  readonly disabled = input(false);
  readonly labelMode = input<'subject' | 'subjectTeacher'>('subjectTeacher');
  readonly selectClass = input(
    'w-full text-sm border border-gray-300 rounded-md px-2 py-2 bg-white dark:border-slate-600 dark:bg-slate-800',
  );

  readonly assignmentChange = output<number | null>();

  optionLabel(row: TeacherSubjectAssignmentRow): string {
    const sub = row.subject?.name?.trim() || `#${row.idSubject}`;
    if (this.labelMode() === 'subject') {
      return sub;
    }
    const t = this.teacherNameById().get(row.idTeacher);
    if (t) {
      return this.translate.instant('weekScheduleBuilder.grid.optionSubjectTeacher', {
        subject: sub,
        teacher: t,
      });
    }
    return sub;
  }

  onModelChange(v: string): void {
    this.assignmentChange.emit(v ? Number(v) : null);
  }
}
