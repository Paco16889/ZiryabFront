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
  private readonly classesApi = inject(WeekScheduleClassesHttpService);

  readonly classKey = weekScheduleClassKey;

  readonly schoolYear = input(environment.currentSchoolYear);
  /** Clave de la clase seleccionada (`weekScheduleClassKey`). */
  readonly selectedClassKey = input('');
  readonly showValidation = input(false);
  readonly disabled = input(false);

  readonly classChange = output<WeekScheduleClassItem | null>();

  readonly loading = signal(true);
  readonly loadError = signal(false);
  private readonly allClasses = signal<WeekScheduleClassItem[]>([]);

  readonly eligibleClasses = computed(() =>
    this.allClasses().filter(isWeekScheduleClassEligibleForCreateTemplate),
  );

  readonly schoolYearLabel = computed(() => this.schoolYear());

  ngOnInit(): void {
    this.loadClasses();
  }

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
