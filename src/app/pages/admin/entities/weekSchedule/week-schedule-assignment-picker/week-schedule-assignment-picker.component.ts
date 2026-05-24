import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeacherSubjectAssignmentRow } from '../../../../../core/models/teacher/subjectforteacher';

/**
 * Desplegable reutilizable: assignments docente–asignatura para un mismo grupo/contexto.
 * Muestra en cada opción asignatura + nombre de profesor (indicativo).
 * @see CURSO-56
 */
@Component({
  selector: 'app-week-schedule-assignment-picker',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './week-schedule-assignment-picker.component.html',
  styleUrl: './week-schedule-assignment-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleAssignmentPickerComponent {
  /** Servicio de traducción para componer etiquetas con asignatura y profesor. */
  private readonly translate = inject(TranslateService);

  /** Filas `TeacherOnSubjectOnGroup` (o equivalente) ya filtradas por el padre. */
  readonly options = input.required<TeacherSubjectAssignmentRow[]>();
  /** Mapa idTeacher → nombre para el texto de la opción. */
  readonly teacherNameById = input.required<Map<number, string>>();
  /** Valor del `<select>` como string (`''` o id de assignment). */
  readonly selectedId = input<string>('');
  /** `id` HTML del select (accesibilidad con `<label for>` del padre). */
  readonly selectId = input.required<string>();
  /** Deshabilita el selector cuando el grid está bloqueado por carga o guardado. */
  readonly disabled = input(false);
  /** Clases Tailwind del `<select>`. */
  readonly selectClass = input(
    'w-full text-sm border border-gray-300 rounded-md px-2 py-2 bg-white dark:border-slate-600 dark:bg-slate-800',
  );

  /** `null` si se elige la opción vacía; si no, `id` del assignment (TeacherOnSubjectOnGroup). */
  readonly assignmentChange = output<number | null>();

  /** Construye el texto de una opción usando asignatura y nombre del profesor si existe. */
  optionLabel(row: TeacherSubjectAssignmentRow): string {
    const t = this.teacherNameById().get(row.idTeacher);
    const sub = row.subject.name;
    if (t) {
      return this.translate.instant('weekScheduleBuilder.grid.optionSubjectTeacher', {
        subject: sub,
        teacher: t,
      });
    }
    return sub;
  }

  /** Convierte el valor nativo del `<select>` en id numérico o `null` para limpiar celda. */
  onChange(ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value;
    this.assignmentChange.emit(v ? Number(v) : null);
  }
}
