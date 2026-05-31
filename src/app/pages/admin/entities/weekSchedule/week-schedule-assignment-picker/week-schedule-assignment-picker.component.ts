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
  /** Etiqueta compuesta asignatura + profesor en i18n. */
  private readonly translate = inject(TranslateService);

  /** Filas ya filtradas y sin duplicar por asignatura. */
  readonly options = input.required<TeacherSubjectAssignmentRow[]>();
  /** Mapa id profesor → nombre para etiquetas compuestas. */
  readonly teacherNameById = input.required<Map<number, string>>();

  /** `''` o id de assignment como string. */
  readonly selectedId = input<string>('');

  /** Atributo `id` del `<select>` para accesibilidad. */
  readonly selectId = input.required<string>();

  /** Deshabilita el desplegable. */
  readonly disabled = input(false);

  /** Formato de etiqueta: solo asignatura o asignatura + profesor. */
  readonly labelMode = input<'subject' | 'subjectTeacher'>('subjectTeacher');

  /** Clases CSS del `<select>`. */
  readonly selectClass = input(
    'w-full text-sm border border-gray-300 rounded-md px-2 py-2 bg-white dark:border-slate-600 dark:bg-slate-800',
  );

  /** Emite el id de asignación elegida o `null` si se limpia. */
  readonly assignmentChange = output<number | null>();

  /** Texto mostrado en cada `<option>`. */
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

  /** Convierte el valor del select a número y lo emite. */
  onModelChange(v: string): void {
    this.assignmentChange.emit(v ? Number(v) : null);
  }
}
