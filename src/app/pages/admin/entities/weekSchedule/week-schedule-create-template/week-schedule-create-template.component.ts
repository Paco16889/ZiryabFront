import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { WeekScheduleClassItem, weekScheduleClassKey } from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekScheduleMaterializeRequest } from '../../../../../core/models/week-schedule-flow/week-schedule-materialize.model';
import { WeekScheduleBulkGenerateHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule-bulk-generate-http.service';
import { WeekScheduleMaterializeHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule-materialize-http.service';
import { isValidHhMmTime, timeToMinutes } from '../../../../../core/utils/time-range';
import { WeekScheduleCreateClassSelectComponent } from '../week-schedule-create-class-select/week-schedule-create-class-select.component';
import {
  WeekScheduleCreateSlotRow,
  WeekScheduleCreateSlotsComponent,
} from '../week-schedule-create-slots/week-schedule-create-slots.component';
import { WeekScheduleCreateWeekdaysComponent } from '../week-schedule-create-weekdays/week-schedule-create-weekdays.component';

const defaultSlot = environment.timetableSlots[0];

/**
 * Orquestador del formulario «Crear plantilla» en el builder de horarios admin.
 * @see https://franciscocobsan.atlassian.net/browse/CURSO-90
 */
@Component({
  selector: 'app-week-schedule-create-template',
  standalone: true,
  imports: [
    TranslateModule,
    WeekScheduleCreateClassSelectComponent,
    WeekScheduleCreateWeekdaysComponent,
    WeekScheduleCreateSlotsComponent,
  ],
  templateUrl: './week-schedule-create-template.component.html',
  styleUrl: './week-schedule-create-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekScheduleCreateTemplateComponent {
  private readonly materializeApi = inject(WeekScheduleMaterializeHttpService);
  private readonly bulkGenerateApi = inject(WeekScheduleBulkGenerateHttpService);
  private readonly translate = inject(TranslateService);

  readonly weekDays = signal<number[]>([]);
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);
  readonly selectedClassKey = signal('');
  readonly slots = signal<WeekScheduleCreateSlotRow[]>([
    {
      startTime: defaultSlot?.startTime ?? '08:15',
      finishTime: defaultSlot?.finishTime ?? '09:15',
    },
  ]);
  readonly submitted = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly saveSuccess = signal(false);
  readonly classListRefresh = signal(0);
  readonly bulkGenerating = signal(false);
  readonly bulkResult = signal<string | null>(null);

  /** Emitido tras POST OK con la clase materializada (CURSO-145). */
  readonly templateCreated = output<WeekScheduleClassItem>();

  readonly showValidation = computed(() => this.submitted());

  readonly formValid = computed(() => {
    if (!this.selectedClass()) {
      return false;
    }
    if (this.weekDays().length === 0) {
      return false;
    }
    if (this.slots().length < 1) {
      return false;
    }
    return this.slots().every((row) => {
      if (!isValidHhMmTime(row.startTime) || !isValidHhMmTime(row.finishTime)) {
        return false;
      }
      return timeToMinutes(row.startTime) < timeToMinutes(row.finishTime);
    });
  });

  readonly canSubmit = computed(() => this.formValid() && !this.saving());

  onClassChange(cls: WeekScheduleClassItem | null): void {
    this.selectedClass.set(cls);
    this.selectedClassKey.set(cls ? weekScheduleClassKey(cls) : '');
    this.saveError.set(null);
    this.saveSuccess.set(false);
  }

  onWeekDaysChange(days: number[]): void {
    this.weekDays.set(days);
  }

  onSlotsChange(rows: WeekScheduleCreateSlotRow[]): void {
    this.slots.set(rows);
  }

  buildMaterializeRequest(): WeekScheduleMaterializeRequest | null {
    const cls = this.selectedClass();
    if (!cls || !this.formValid()) {
      return null;
    }
    return {
      label: cls.label,
      schoolYear: cls.schoolYear,
      weekDays: [...this.weekDays()],
      slots: this.slots().map((row) => ({
        startTime: row.startTime,
        finishTime: row.finishTime,
      })),
    };
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.saveError.set(null);
    if (!this.formValid()) {
      return;
    }
    const payload = this.buildMaterializeRequest();
    if (payload == null) {
      return;
    }

    this.saving.set(true);
    this.materializeApi.materialize(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success && res.data) {
          const createdClass = this.selectedClass();
          this.saveSuccess.set(true);
          this.selectedClass.set(null);
          this.selectedClassKey.set('');
          this.weekDays.set([]);
          this.slots.set([
            {
              startTime: defaultSlot?.startTime ?? '08:15',
              finishTime: defaultSlot?.finishTime ?? '09:15',
            },
          ]);
          this.submitted.set(false);
          this.classListRefresh.update((v) => v + 1);
          if (createdClass) {
            this.templateCreated.emit(createdClass);
          }
          // Lanza bulk en paralelo (fire & forget) — no bloquea la UI (EQ-297)
          if (createdClass) {
            this.bulkGenerating.set(true);
            this.bulkGenerateApi.bulkGenerate({
              label: createdClass.label,
              schoolYear: createdClass.schoolYear,
            }).subscribe({
              next: (bulkRes) => {
                this.bulkGenerating.set(false);
                if (bulkRes.success) {
                  this.bulkResult.set(
                    this.translate.instant('weekScheduleBuilder.create.bulkSuccess', {
                      created: bulkRes.created ?? 0,
                    })
                  );
                } else {
                  this.bulkResult.set(
                    this.translate.instant('weekScheduleBuilder.create.bulkError')
                  );
                }
              },
              error: () => {
                this.bulkGenerating.set(false);
                this.bulkResult.set(
                  this.translate.instant('weekScheduleBuilder.create.bulkError')
                );
              },
            });
          }
          return;
        }
        this.saveError.set(
          res.error ??
            res.message ??
            this.translate.instant('weekScheduleBuilder.create.saveError'),
        );
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set(this.translate.instant('weekScheduleBuilder.create.saveError'));
      },
    });
  }
}
