import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleBuilderSubmitService } from '../../../../../core/services/admin/week-schedule-builder-submit.service';
import { WeekScheduleGridBuilderComponent } from '../week-schedule-grid-builder/week-schedule-grid-builder.component';
import { WeekScheduleBuilderSelectsComponent } from '../week-schedule-builder-selects/week-schedule-builder-selects.component';
import { WeekScheduleBuilderSlotFormComponent } from '../week-schedule-builder-slot-form/week-schedule-builder-slot-form.component';

function weekScheduleTimeOrderValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('startTime')?.value as string | undefined;
    const end = group.get('finishTime')?.value as string | undefined;
    if (start == null || end == null || start === '' || end === '') {
      return null;
    }
    return start < end ? null : { timeOrder: true };
  };
}

/**
 * Orquestador del flujo de creación de franjas horarias en el panel admin.
 * Delega bloques en subcomponentes y el POST en `WeekScheduleBuilderSubmitService`.
 */
@Component({
  selector: 'app-week-schedule-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    WeekScheduleBuilderSelectsComponent,
    WeekScheduleBuilderSlotFormComponent,
    WeekScheduleGridBuilderComponent,
  ],
  templateUrl: './week-schedule-builder.component.html',
  styleUrl: './week-schedule-builder.component.scss',
})
export class WeekScheduleBuilderComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly submitService = inject(WeekScheduleBuilderSubmitService);
  private readonly destroyRef = inject(DestroyRef);

  readonly cancelCreate = output<void>();
  readonly scheduleCreated = output<void>();

  readonly saveError = signal(false);
  readonly saving = signal(false);

  /** `simple`: formulario franja a franja; `grid`: rejilla L–V con DnD. */
  readonly builderMode = signal<'simple' | 'grid'>('simple');

  readonly form = this.fb.nonNullable.group(
    {
      groupId: [null as number | null, Validators.required],
      assignmentId: [null as number | null, Validators.required],
      peerAssignmentId: [null as number | null, Validators.required],
      weekDay: [1, [Validators.required, Validators.min(1), Validators.max(7)]],
      startTime: ['09:00', Validators.required],
      finishTime: ['10:00', Validators.required],
    },
    { validators: [weekScheduleTimeOrderValidator()] },
  );

  readonly weekdays = [1, 2, 3, 4, 5, 6, 7] as const;

  ngOnInit(): void {
    this.form.controls.startTime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
    this.form.controls.finishTime.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }

  setBuilderMode(mode: 'simple' | 'grid'): void {
    this.builderMode.set(mode);
  }

  onGridScheduleSaved(): void {
    this.scheduleCreated.emit();
  }

  clearSaveError(): void {
    this.saveError.set(false);
  }

  onSubmit(): void {
    this.saveError.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const idTa = v.peerAssignmentId;
    if (idTa == null) {
      return;
    }
    this.saving.set(true);
    this.submitService
      .createWeeklySlot({
        idTeacherAssignment: idTa,
        weekDay: v.weekDay,
        startTime: v.startTime,
        finishTime: v.finishTime,
      })
      .subscribe({
        next: (ok) => {
          this.saving.set(false);
          if (ok) {
            this.scheduleCreated.emit();
          } else {
            this.saveError.set(true);
          }
        },
        error: () => {
          this.saving.set(false);
          this.saveError.set(true);
        },
      });
  }
}
