import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';
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
import {
  defaultWeekScheduleSlotRow,
  maxSlotRowsForTemplate,
} from '../week-schedule-create-slots/week-schedule-create-slots.util';
import { WeekScheduleCreateWeekdaysComponent } from '../week-schedule-create-weekdays/week-schedule-create-weekdays.component';

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
  /** POST materializar plantilla de franjas. */
  private readonly materializeApi = inject(WeekScheduleMaterializeHttpService);

  /** POST generar horarios en bloque tras materializar. */
  private readonly bulkGenerateApi = inject(WeekScheduleBulkGenerateHttpService);

  /** Horas semanales del ciclo+curso para calcular máximo de franjas. */
  private readonly assignmentsService = inject(AssignmentsService);

  /** Mensajes de éxito/error i18n. */
  private readonly translate = inject(TranslateService);

  /** Preselección tras navegar desde asignaciones docentes (EQ-309). */
  readonly preselectClassKey = input('');

  /** Días de la semana seleccionados (1 = lunes … 7 = domingo). */
  readonly weekDays = signal<number[]>([]);

  /** Clase elegida para materializar la plantilla. */
  readonly selectedClass = signal<WeekScheduleClassItem | null>(null);

  /** Clave estable de la clase en el selector hijo. */
  readonly selectedClassKey = signal('');

  /** Filas de franjas horarias (inicio/fin) de la plantilla. */
  readonly slots = signal<WeekScheduleCreateSlotRow[]>([defaultWeekScheduleSlotRow()]);

  /** Máximo de franjas permitidas según horas semanales y días elegidos. */
  readonly maxSlots = signal<number | null>(null);

  /** Suma de `hours` de las asignaturas del ciclo+grade (presupuesto semanal). */
  readonly weeklyHoursTotal = signal<number | null>(null);

  /** El usuario pulsó enviar al menos una vez (activa validación visual). */
  readonly submitted = signal(false);

  /** POST de materialización en curso. */
  readonly saving = signal(false);

  /** Mensaje de error del API o i18n tras fallo de guardado. */
  readonly saveError = signal<string | null>(null);

  /** Indica que la materialización terminó correctamente. */
  readonly saveSuccess = signal(false);

  /** Contador para forzar recarga del selector de clases tras crear plantilla. */
  readonly classListRefresh = signal(0);

  /** Bulk-generate de sesiones en curso tras materializar. */
  readonly bulkGenerating = signal(false);

  /** Mensaje de resultado del bulk-generate (éxito o error i18n). */
  readonly bulkResult = signal<string | null>(null);

  /** Emitido tras POST OK con la clase materializada (CURSO-145). */
  readonly templateCreated = output<WeekScheduleClassItem>();

  /** Muestra errores de validación tras el primer intento de envío. */
  readonly showValidation = computed(() => this.submitted());

  /** Clase, días, franjas y rangos horarios coherentes. */
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
    const max = this.maxSlots();
    if (max != null && max > 0 && this.slots().length > max) {
      return false;
    }
    return this.slots().every((row) => {
      if (!isValidHhMmTime(row.startTime) || !isValidHhMmTime(row.finishTime)) {
        return false;
      }
      return timeToMinutes(row.startTime) < timeToMinutes(row.finishTime);
    });
  });

  /** Envío habilitado si el formulario es válido y no hay guardado en curso. */
  readonly canSubmit = computed(() => this.formValid() && !this.saving());

  /** Clave de clase para el selector hijo (preselección o selección actual). */
  readonly classSelectKey = computed(
    () => this.preselectClassKey() || this.selectedClassKey(),
  );

  /** Actualiza clase seleccionada y recarga horas semanales. */
  onClassChange(cls: WeekScheduleClassItem | null): void {
    this.selectedClass.set(cls);
    this.selectedClassKey.set(cls ? weekScheduleClassKey(cls) : '');
    this.saveError.set(null);
    this.saveSuccess.set(false);
    this.loadWeeklyHoursForClass(cls);
  }

  /** Consulta asignaturas del ciclo+grade y actualiza `weeklyHoursTotal` y `maxSlots`. */
  private loadWeeklyHoursForClass(cls: WeekScheduleClassItem | null): void {
    if (cls == null) {
      this.weeklyHoursTotal.set(null);
      this.recalculateMaxSlots();
      return;
    }
    this.assignmentsService
      .getSubjectsByCourseAndGrade(cls.course.id, cls.grade)
      .subscribe((res) => {
        if (!res.success || res.data.length === 0) {
          this.weeklyHoursTotal.set(null);
          this.recalculateMaxSlots();
          return;
        }
        const sum = res.data.reduce((acc, s) => acc + (s.hours ?? 0), 0);
        this.weeklyHoursTotal.set(sum > 0 ? sum : null);
        this.recalculateMaxSlots();
      });
  }

  /** Horas semanales ÷ días marcados = máximo de franjas en la plantilla. */
  private recalculateMaxSlots(): void {
    const total = this.weeklyHoursTotal();
    const dayCount = this.weekDays().length;
    const max = total != null ? maxSlotRowsForTemplate(total, dayCount) : null;
    this.maxSlots.set(max);
    if (max != null && this.slots().length > max) {
      this.slots.set(this.slots().slice(0, max));
    }
  }

  /** Sincroniza días de la semana desde el hijo y recalcula máximo de franjas. */
  onWeekDaysChange(days: number[]): void {
    this.weekDays.set(days);
    this.recalculateMaxSlots();
  }

  /** Sincroniza filas de franjas horarias desde el hijo. */
  onSlotsChange(rows: WeekScheduleCreateSlotRow[]): void {
    this.slots.set(rows);
  }

  /** Construye el cuerpo del POST de materialización si el formulario es válido. */
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

  /** Materializa la plantilla y, si OK, lanza bulk-generate para la clase creada. */
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
          this.maxSlots.set(null);
          this.weeklyHoursTotal.set(null);
          this.weekDays.set([]);
          this.slots.set([defaultWeekScheduleSlotRow()]);
          this.submitted.set(false);
          this.classListRefresh.update((v) => v + 1);
          if (createdClass) {
            this.templateCreated.emit(createdClass);
          }
          if (createdClass) {
            this.bulkGenerating.set(true);
            this.bulkGenerateApi
              .bulkGenerate({
                label: createdClass.label,
                schoolYear: createdClass.schoolYear,
              })
              .subscribe({
                next: (bulkRes) => {
                  this.bulkGenerating.set(false);
                  if (bulkRes.success) {
                    this.bulkResult.set(
                      this.translate.instant('weekScheduleBuilder.create.bulkSuccess', {
                        created: bulkRes.created ?? 0,
                      }),
                    );
                  } else {
                    this.bulkResult.set(
                      this.translate.instant('weekScheduleBuilder.create.bulkError'),
                    );
                  }
                },
                error: () => {
                  this.bulkGenerating.set(false);
                  this.bulkResult.set(
                    this.translate.instant('weekScheduleBuilder.create.bulkError'),
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
