import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { AssistanceStatus } from '../../../../../core/models/assistance';
import { AssistanceService } from '../../../../../core/services/admin/entities/assistance.service';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { EnrollmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/enrollment-http.service';
import { environment } from '../../../../../../environments/environment';

/** Formulario admin para crear registros de asistencia manuales. */
@Component({
  selector: 'app-assistance-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './assistance-create-form.component.html',
  styleUrl: './assistance-create-form.component.scss',
})
export class AssistanceCreateFormComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio CRUD de asistencias. */
  private readonly assistanceService = inject(AssistanceService);
  /** Servicio de sesiones para elegir la clase asociada. */
  private readonly sessionService = inject(ClassSessionService);
  /** Catálogo de grupos para filtrar matrículas. */
  private readonly groupService = inject(GroupService);
  /** Catálogo de asignaturas para filtrar matrículas. */
  private readonly subjectService = inject(SubjectService);
  /** Cliente de matrículas por filtros para elegir alumno. */
  private readonly enrollmentHttp = inject(EnrollmentHttpService);
  /** Traducciones de mensajes de error. */
  private readonly translate = inject(TranslateService);

  /** Cancela la creación y vuelve al listado. */
  readonly cancelCreate = output<void>();
  /** Notifica que se creó la asistencia para recargar el listado. */
  readonly assistanceCreated = output<void>();

  /** Sesiones disponibles para asociar la asistencia. */
  readonly sessionOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Grupos disponibles para filtrar alumnos. */
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Asignaturas disponibles para filtrar alumnos. */
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Matrículas que coinciden con grupo, asignatura y año escolar. */
  readonly enrollmentOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Estado de carga del selector de sesiones. */
  readonly loadingSessions = signal(true);
  /** Estado de carga del selector de matrículas. */
  readonly loadingEnrollments = signal(false);

  /** Formulario que recoge sesión, filtros de matrícula y estado inicial. */
  createForm = this.fb.group({
    idSession: [null as number | null, Validators.required],
    filterGroup: [null as number | null, Validators.required],
    filterSubject: [null as number | null, Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    idStudentEnrollment: [null as number | null, Validators.required],
    status: [AssistanceStatus.PRESENT],
  });

  /** Evita doble envío durante la creación. */
  isCreating = false;
  /** Error traducido mostrado en el formulario. */
  errorMessage = '';

  /** Carga sesiones, grupos y asignaturas necesarios para el formulario. */
  ngOnInit(): void {
    this.sessionService.getAllSessions().subscribe((res) => {
      this.loadingSessions.set(false);
      this.sessionOptions.set(
        res.success
          ? res.data.map((s) => ({
              value: s.id,
              label: `${s.date?.split('T')[0] ?? s.id} · ${s.status}`,
            }))
          : [],
      );
    });
    this.groupService.getAllGroups().subscribe((res) => {
      this.groupOptions.set(
        res.success ? res.data.map((g) => ({ value: g.id, label: g.name })) : [],
      );
    });
    this.subjectService.getAllSubjects().subscribe((res) => {
      this.subjectOptions.set(
        res.success ? res.data.map((s) => ({ value: s.id, label: s.name })) : [],
      );
    });
  }

  /** Carga matrículas tras elegir grupo, asignatura y curso escolar. */
  loadEnrollments(): void {
    const g = this.createForm.get('filterGroup')?.value;
    const s = this.createForm.get('filterSubject')?.value;
    const y = this.createForm.get('schoolYear')?.value;
    if (g == null || s == null || !y) return;

    this.loadingEnrollments.set(true);
    this.enrollmentHttp.getByFilters({ idGroup: g, idSubject: s, schoolYear: y }).subscribe((res) => {
      this.loadingEnrollments.set(false);
      this.enrollmentOptions.set(
        res.success
          ? res.data.map((e) => ({
              value: e.id,
              label: [e.student?.name, e.student?.surname].filter(Boolean).join(' ') || `Matrícula ${e.id}`,
            }))
          : [],
      );
      this.createForm.patchValue({ idStudentEnrollment: null });
    });
  }

  /** Valida y crea el registro de asistencia. */
  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const raw = this.createForm.getRawValue();
    this.isCreating = true;
    this.errorMessage = '';

    this.assistanceService
      .createAssistance({
        idSession: raw.idSession as number,
        idStudentEnrollment: raw.idStudentEnrollment as number,
        status: raw.status as AssistanceStatus,
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.assistanceCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createAssistance');
        },
      });
  }

  /** Cancela el formulario sin crear asistencia. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
