import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { WeekScheduleClassItem, weekScheduleClassKey } from '../../../../../core/models/week-schedule-flow/week-schedule-class.model';
import { WeekScheduleMaterializeRequest } from '../../../../../core/models/week-schedule-flow/week-schedule-materialize.model';
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

  /** Hasta que exista POST de materialización (CURSO-71). */
  readonly materializeApiReady = false;

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

  onClassChange(cls: WeekScheduleClassItem | null): void {
    this.selectedClass.set(cls);
    this.selectedClassKey.set(cls ? weekScheduleClassKey(cls) : '');
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
    if (!this.formValid()) {
      return;
    }
    if (!this.materializeApiReady) {
      return;
    }
    const payload = this.buildMaterializeRequest();
    if (payload == null) {
      return;
    }
    // TODO [CURSO-71]: WeekScheduleMaterializeHttpService.post(payload)
    void payload;
  }
}
