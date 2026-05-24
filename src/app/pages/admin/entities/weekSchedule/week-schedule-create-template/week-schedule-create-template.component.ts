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

/** Primera franja del horario del centro, usada como valor inicial de la plantilla. */
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
  /** Días laborables elegidos para generar la plantilla (`1` = lunes, `5` = viernes). */
  readonly weekDays = signal<number[]>([]);

  /** Clase académica (curso, nivel, grupo y año escolar) sobre la que se materializará la plantilla. */
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);

  /** Clave estable de la clase seleccionada para mantener sincronizado el selector hijo. */
  readonly selectedClassKey = signal('');

  /** Franjas inicio-fin que se repetirán en cada día seleccionado. */
  readonly slots = signal<WeekScheduleCreateSlotRow[]>([
    {
      startTime: defaultSlot?.startTime ?? '08:15',
      finishTime: defaultSlot?.finishTime ?? '09:15',
    },
  ]);

  /** Indica que el usuario ya intentó enviar, activando mensajes de validación. */
  readonly submitted = signal(false);

  /** Hasta que exista POST de materialización (CURSO-71). */
  readonly materializeApiReady = false;

  /** Propaga el estado de validación a los subformularios solo tras intentar enviar. */
  readonly showValidation = computed(() => this.submitted());

  /**
   * Valida que exista clase, al menos un día y franjas con formato `HH:mm`
   * donde la hora de inicio sea anterior a la de fin.
   */
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

  /** Sincroniza la clase emitida por el selector y su clave serializada. */
  onClassChange(cls: WeekScheduleClassItem | null): void {
    this.selectedClass.set(cls);
    this.selectedClassKey.set(cls ? weekScheduleClassKey(cls) : '');
  }

  /** Actualiza la selección de días recibida desde el componente de checkboxes. */
  onWeekDaysChange(days: number[]): void {
    this.weekDays.set(days);
  }

  /** Sustituye las franjas completas cuando cambia el subformulario de horas. */
  onSlotsChange(rows: WeekScheduleCreateSlotRow[]): void {
    this.slots.set(rows);
  }

  /**
   * Construye el DTO esperado por el futuro endpoint de materialización.
   * Devuelve `null` si el formulario aún no cumple las reglas mínimas.
   */
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

  /**
   * Marca el formulario como enviado y, cuando el endpoint esté disponible,
   * enviará la plantilla validada para generar las sesiones/horarios persistidos.
   */
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
