import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';

@Component({
  selector: 'app-class-session-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './class-session-create-form.component.html',
  styleUrl: './class-session-create-form.component.scss',
})
export class ClassSessionCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(ClassSessionService);
  private readonly scheduleService = inject(WeekScheduleService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly sessionCreated = output<void>();

  readonly scheduleOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingSchedules = signal(true);

  createForm = this.fb.group({
    idSchedule: [null as number | null, Validators.required],
    date: ['', Validators.required],
    status: ['SCHEDULED'],
    appointments: [''],
  });

  isCreating = false;
  errorMessage = '';

  ngOnInit(): void {
    this.scheduleService.getAllSchedules().subscribe((res) => {
      this.loadingSchedules.set(false);
      if (!res.success) {
        this.scheduleOptions.set([]);
        return;
      }
      this.scheduleOptions.set(
        res.data.map((ws) => ({
          value: ws.id,
          label: this.translate.instant('adminPages.classSessions.scheduleOption', {
            day: ws.weekDay,
            start: ws.startTime,
            end: ws.finishTime,
            id: ws.id,
          }),
        })),
      );
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const raw = this.createForm.getRawValue();
    this.isCreating = true;
    this.errorMessage = '';

    this.sessionService
      .createSession({
        idSchedule: raw.idSchedule as number,
        date: raw.date as string,
        status: raw.status || undefined,
        appointments: raw.appointments?.trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.sessionCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage =
            err.error?.message ??
            this.translate.instant('adminPages.errors.classSessionCreate');
        },
      });
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
