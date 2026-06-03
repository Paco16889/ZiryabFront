import {

  ChangeDetectionStrategy,

  Component,

  computed,

  effect,

  inject,

  input,

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
import { weekScheduleClassKeyFromParts } from '../../../../../core/utils/week-schedule-class-key';



/**

 * Selector de clase para crear plantilla horaria.

 * `GET .../classes?schoolYear=...&hasWeekSchedule=false`

 */

@Component({

  selector: 'app-week-schedule-create-class-select',

  standalone: true,

  imports: [TranslateModule],

  templateUrl: './week-schedule-create-class-select.component.html',

  styleUrl: './week-schedule-create-class-select.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class WeekScheduleCreateClassSelectComponent {

  /** Listado de clases sin plantilla horaria (`hasWeekSchedule=false`). */
  private readonly classesApi = inject(WeekScheduleClassesHttpService);



  /** Función expuesta al template para clave de clase. */
  readonly classKey = weekScheduleClassKey;

  /** Año escolar del listado de clases sin plantilla. */
  readonly schoolYear = input(environment.currentSchoolYear);

  /** Clave de clase a preseleccionar al cargar. */
  readonly selectedClassKey = input('');

  /** Muestra error si no hay clase elegida. */
  readonly showValidation = input(false);

  /** Deshabilita el selector. */
  readonly disabled = input(false);

  /** Incrementar para forzar recarga del listado. */
  readonly refreshToken = input(0);

  /** Emite la clase elegida o `null` si se limpia. */
  readonly classChange = output<WeekScheduleClassItem | null>();

  /** Carga de clases en curso. */
  readonly loading = signal(true);

  /** Error al obtener clases del API. */
  readonly loadError = signal(false);

  /** Respuesta cruda del API antes de filtrar elegibles. */
  private readonly classesFromApi = signal<WeekScheduleClassItem[]>([]);



  /** Clases elegibles para crear plantilla (sin horario materializado). */
  readonly classesWithoutSchedule = computed(() =>

    this.classesFromApi().filter(isWeekScheduleClassEligibleForCreateTemplate),

  );

  /** Clave de preselección ya aplicada (evita emitir duplicados). */
  private readonly preselectApplied = signal('');



  /** Año escolar mostrado en la UI del selector. */
  readonly schoolYearLabel = computed(() => this.schoolYear());



  /** Recarga clases al cambiar año o token; aplica preselección cuando hay listado. */
  constructor() {

    effect(() => {

      this.schoolYear();

      this.refreshToken();

      this.loadClasses();

    });

    effect(() => {

      this.tryApplyPreselect(this.selectedClassKey(), this.classesWithoutSchedule());

    });

  }



  /** Obtiene clases sin horario semanal para el año escolar. */
  loadClasses(): void {

    this.loading.set(true);

    this.loadError.set(false);

    this.classesApi.getAllClasses(this.schoolYear(), true).subscribe({

      next: (res) => {

        this.loading.set(false);

        const list = res.success

          ? [...res.data].sort((a, b) => a.label.localeCompare(b.label))

          : [];

        this.classesFromApi.set(list);

        if (!res.success) {

          this.loadError.set(true);

        }

        this.tryApplyPreselect(this.selectedClassKey(), this.classesWithoutSchedule());

      },

      error: () => {

        this.loading.set(false);

        this.loadError.set(true);

        this.classesFromApi.set([]);

      },

    });

  }



  /** Emite la clase correspondiente a la clave del `<select>`. */
  onSelectChange(raw: string): void {

    if (!raw) {

      this.classChange.emit(null);

      return;

    }

    const found =

      this.classesWithoutSchedule().find((c) => this.classKeysMatch(c, raw)) ?? null;

    this.classChange.emit(found);

  }

  /** Aplica preselección una sola vez cuando el listado está listo. */
  private tryApplyPreselect(key: string, classes: WeekScheduleClassItem[]): void {

    if (!key || classes.length === 0 || this.preselectApplied() === key) {

      return;

    }

    const found = classes.find((c) => this.classKeysMatch(c, key)) ?? null;

    if (found) {

      this.preselectApplied.set(key);

      this.classChange.emit(found);

    }

  }

  /** Compara claves de clase en distintos formatos. */
  private classKeysMatch(item: WeekScheduleClassItem, key: string): boolean {

    return (

      weekScheduleClassKey(item) === key ||

      weekScheduleClassKeyFromParts(

        item.course.id,

        item.grade,

        item.group.id,

        item.schoolYear,

      ) === key

    );

  }

}


