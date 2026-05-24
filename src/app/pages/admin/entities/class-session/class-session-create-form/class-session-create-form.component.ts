import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { WeekScheduleService } from '../../../../../core/services/admin/entities/services-for-week-schedule/week-schedule.service';

/** Formulario admin para crear una sesión de clase a partir de una franja semanal. */
@Component({
  selector: 'app-class-session-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './class-session-create-form.component.html',
  styleUrl: './class-session-create-form.component.scss',
})
export class ClassSessionCreateFormComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio CRUD de sesiones. */
  private readonly sessionService = inject(ClassSessionService);
  /** Traducciones de errores del backend. */
  private readonly translate = inject(TranslateService);
  /** Servicio de horarios para poblar el selector de franja. */
  private readonly scheduleService = inject(WeekScheduleService);

  /** Cancela la creación y vuelve al listado. */
  readonly cancelCreate = output<void>();
  /** Notifica al listado que debe recargar tras crear. */
  readonly sessionCreated = output<void>();

  /** Franjas semanales disponibles para crear la sesión. */
  readonly scheduleOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Estado de carga del selector de franjas. */
  readonly loadingSchedules = signal(true);

  /** Formulario de creación con franja, fecha, estado y anotaciones. */
  createForm = this.fb.group({
    idSchedule: [null as number | null, Validators.required],
    date: ['', Validators.required],
    status: ['SCHEDULED'],
    appointments: [''],
  });

  /** Evita doble envío durante la creación. */
  isCreating = false;
  /** Error traducido mostrado al usuario. */
  errorMessage = '';

  /** Carga las franjas semanales disponibles. */
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
          label: `Día ${ws.weekDay} · ${ws.startTime}-${ws.finishTime} (#${ws.id})`,
        })),
      );
    });
  }

  /** Valida y crea la sesión de clase. */
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
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createSession');
        },
      });
  }

  /** Cancela el formulario sin crear sesión. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
