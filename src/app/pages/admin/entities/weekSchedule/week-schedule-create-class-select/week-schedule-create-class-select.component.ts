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

  private readonly classesApi = inject(WeekScheduleClassesHttpService);



  readonly classKey = weekScheduleClassKey;



  readonly schoolYear = input(environment.currentSchoolYear);

  readonly selectedClassKey = input('');

  readonly showValidation = input(false);

  readonly disabled = input(false);

  readonly refreshToken = input(0);



  readonly classChange = output<WeekScheduleClassItem | null>();



  readonly loading = signal(true);

  readonly loadError = signal(false);

  private readonly classesFromApi = signal<WeekScheduleClassItem[]>([]);



  readonly classesWithoutSchedule = computed(() =>

    this.classesFromApi().filter(isWeekScheduleClassEligibleForCreateTemplate),

  );

  private readonly preselectApplied = signal('');



  readonly schoolYearLabel = computed(() => this.schoolYear());



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



  onSelectChange(raw: string): void {

    if (!raw) {

      this.classChange.emit(null);

      return;

    }

    const found =

      this.classesWithoutSchedule().find((c) => this.classKeysMatch(c, raw)) ?? null;

    this.classChange.emit(found);

  }

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


