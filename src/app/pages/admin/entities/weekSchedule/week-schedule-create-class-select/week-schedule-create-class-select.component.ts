import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import {
  isWeekScheduleClassEligibleForCreateTemplate,
  WeekScheduleClassItem,
  weekScheduleClassKey,
} from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekScheduleClassesHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule-classes-http.service';

/**
 * Selector de clase para crear plantilla horaria (filtro y estados de carga).
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-90
 */
@Component({
  selector: 'app-week-schedule-create-class-select',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './week-schedule-create-class-select.component.html',
  styleUrl: './week-schedule-create-class-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleCreateClassSelectComponent implements OnInit {
  /** Cliente HTTP específico que devuelve las clases agregadas para crear plantillas. */
  private readonly classesApi = inject(WeekScheduleClassesHttpService);

  /** Helper expuesto al template para usar la misma clave que el formulario padre. */
  readonly classKey = weekScheduleClassKey;

  /** Curso escolar usado para consultar y mostrar solo clases del año activo. */
  readonly schoolYear = input(environment.currentSchoolYear);

  /** Clave de la clase seleccionada (`weekScheduleClassKey`). */
  readonly selectedClassKey = input('');

  /** Activa el mensaje de selección obligatoria tras intentar enviar el formulario padre. */
  readonly showValidation = input(false);

  /** Bloquea el selector cuando la creación de plantilla no debe modificarse. */
  readonly disabled = input(false);

  /** Emite la clase completa, no solo la clave, para construir luego el payload. */
  readonly classChange = output<WeekScheduleClassItem | null>();

  /** Estado de carga mientras se consulta el endpoint de clases. */
  readonly loading = signal(true);

  /** Indica que la consulta falló o devolvió una respuesta no exitosa. */
  readonly loadError = signal(false);

  /** Cache local de clases devueltas por el API antes de aplicar filtros de elegibilidad. */
  private readonly allClasses = signal<WeekScheduleClassItem[]>([]);

  /** Clases con curso/grupo/año suficientes para poder materializar una plantilla. */
  readonly eligibleClasses = computed(() =>
    this.allClasses().filter(isWeekScheduleClassEligibleForCreateTemplate),
  );

  /** Etiqueta del año escolar que se muestra junto al selector. */
  readonly schoolYearLabel = computed(() => this.schoolYear());

  /** Carga las clases disponibles al montar el selector. */
  ngOnInit(): void {
    this.loadClasses();
  }

  /** Consulta el API y ordena las clases por etiqueta para facilitar la selección. */
  loadClasses(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.classesApi.getAllClasses(this.schoolYear()).subscribe({
      next: (res) => {
        this.loading.set(false);
        const list = res.success
          ? [...res.data].sort((a, b) => a.label.localeCompare(b.label))
          : [];
        this.allClasses.set(list);
        if (!res.success) {
          this.loadError.set(true);
        }
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
        this.allClasses.set([]);
      },
    });
  }

  /** Traduce la clave seleccionada en el `<select>` a la clase agregada completa. */
  onSelectChange(raw: string): void {
    if (!raw) {
      this.classChange.emit(null);
      return;
    }
    const found =
      this.eligibleClasses().find((c) => weekScheduleClassKey(c) === raw) ?? null;
    this.classChange.emit(found);
  }
}
