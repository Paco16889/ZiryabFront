import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/week-schedule.service';
import { WeekSchedule } from '../../../../../core/models/week-schedule';
import { ClassSessionCreateRequest } from '../../../../../core/models/class-sessions';
import { prismaDayOfWeekToNumber } from '../../../../../core/utils/week-day';

type WeekScheduleWithDetails = WeekSchedule & {
  teacherAssignment?: WeekSchedule['teacherAssignment'] & {
    subject?: { name: string };
    group?: { name: string };
  };
};

/**
 * Formulario de creación de una sesión de clase.
 * Carga las franjas horarias disponibles y envía los datos al backend tras validar.
 */
@Component({
  selector: 'app-class-session-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './class-session-create-form.component.html',
  styleUrl: './class-session-create-form.component.scss',
})
export class ClassSessionCreateFormComponent implements OnInit {
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() sessionCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private classSessionService = inject(ClassSessionService);
  private weekScheduleService = inject(WeekScheduleService);
  private translate = inject(TranslateService);

  createForm: FormGroup;
  schedules: WeekScheduleWithDetails[] = [];
  isCreating = false;
  isLoadingSchedules = true;
  errorMessage = '';

  readonly statusOptions = [
    { value: 'SCHEDULED', labelKey: 'classSessionCreateForm.statusScheduled' },
    { value: 'COMPLETED', labelKey: 'classSessionCreateForm.statusCompleted' },
    { value: 'CANCELLED', labelKey: 'classSessionCreateForm.statusCancelled' },
  ] as const;

  constructor() {
    this.createForm = this.fb.group({
      idSchedule: ['', Validators.required],
      date: ['', Validators.required],
      status: ['SCHEDULED'],
      appointments: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit(): void {
    this.weekScheduleService.getAllSchedules().subscribe({
      next: (response) => {
        this.schedules = response.data ?? [];
        this.isLoadingSchedules = false;
      },
      error: () => {
        this.errorMessage = this.translate.instant('classSessionCreateForm.errorSchedules');
        this.isLoadingSchedules = false;
      },
    });
  }

  /** Etiqueta legible para cada franja horaria del selector. */
  getScheduleLabel(schedule: WeekScheduleWithDetails): string {
    const dayNum = prismaDayOfWeekToNumber(schedule.weekDay as string | number);
    const day = this.translate.instant(`horario.days.${dayNum}`);
    const time = `${schedule.startTime} – ${schedule.finishTime}`;
    const subject = schedule.teacherAssignment?.subject?.name;
    const group = schedule.teacherAssignment?.group?.name;
    const detail = [subject, group].filter(Boolean).join(' · ');
    return detail ? `${day} · ${time} (${detail})` : `${day} · ${time}`;
  }

  onSubmit(): void {
    if (!this.createForm.valid) {
      return;
    }

    const { idSchedule, date, status, appointments } = this.createForm.value;
    const payload: ClassSessionCreateRequest = {
      idSchedule: Number(idSchedule),
      date,
      status: status || 'SCHEDULED',
      ...(appointments?.trim() ? { appointments: appointments.trim() } : {}),
    };

    this.isCreating = true;
    this.errorMessage = '';

    this.classSessionService.createSession(payload).subscribe({
      next: () => {
        this.sessionCreated.emit();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage =
          err.error?.message || this.translate.instant('classSessionCreateForm.errorCreate');
      },
    });
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
