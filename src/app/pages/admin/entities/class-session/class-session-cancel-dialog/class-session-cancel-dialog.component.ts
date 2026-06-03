import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, EMPTY, filter, switchMap } from 'rxjs';
import { SessionSuspendFilters } from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';

/** Opción de selector usada por los filtros de suspensión masiva. */
interface SelectOption {
  /** Identificador del recurso filtrable. */
  value: number;
  /** Etiqueta visible en el selector. */
  label: string;
}

/** Diálogo para previsualizar y suspender sesiones de clase por rango y filtros. */
@Component({
  selector: 'app-class-session-cancel-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './class-session-cancel-dialog.component.html',
  styleUrl: './class-session-cancel-dialog.component.scss',
})
export class ClassSessionCancelDialogComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Ciclo de vida usado para cancelar la suscripción de preview. */
  private readonly destroyRef = inject(DestroyRef);
  /** Servicio de sesiones para preview y suspensión masiva. */
  private readonly sessionService = inject(ClassSessionService);
  /** Catálogo de ciclos para filtrar la suspensión. */
  private readonly courseService = inject(CourseService);
  /** Catálogo de asignaturas para filtrar la suspensión. */
  private readonly subjectService = inject(SubjectService);
  /** Catálogo de grupos para filtrar la suspensión. */
  private readonly groupService = inject(GroupService);
  /** Catálogo de profesores para filtrar la suspensión. */
  private readonly teachersService = inject(TeachersService);

  /** Cierra el diálogo sin aplicar cambios. */
  readonly closed = output<void>();
  /** Emite el número de sesiones suspendidas correctamente. */
  readonly suspended = output<number>();

  /** Opciones de ciclo. */
  readonly courseOptions = signal<SelectOption[]>([]);
  /** Opciones de asignatura. */
  readonly subjectOptions = signal<SelectOption[]>([]);
  /** Opciones de grupo. */
  readonly groupOptions = signal<SelectOption[]>([]);
  /** Opciones de profesor. */
  readonly teacherOptions = signal<SelectOption[]>([]);
  /** Estado de carga de catálogos. */
  readonly loadingOptions = signal(true);

  /** Número de sesiones afectadas por los filtros actuales. */
  readonly previewCount = signal<number | null>(null);
  /** Estado de carga del preview. */
  readonly previewLoading = signal(false);
  /** Error al calcular preview. */
  readonly previewError = signal(false);

  /** Estado de envío de la suspensión masiva. */
  readonly isSubmitting = signal(false);
  /** Clave i18n de error al suspender. */
  readonly submitError = signal('');

  /** Formulario de filtros: rango obligatorio y filtros académicos opcionales. */
  form = this.fb.group({
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    idCourse: [null as number | null],
    idSubject: [null as number | null],
    idGroup: [null as number | null],
    idTeacher: [null as number | null],
  });

  /** Carga catálogos y activa el preview reactivo. */
  ngOnInit(): void {
    this.loadFilterOptions();
    this.setupPreviewSubscription();
  }

  /** Carga los catálogos necesarios para los filtros del diálogo. */
  private loadFilterOptions(): void {
    let pending = 4;
    const done = () => {
      pending -= 1;
      if (pending === 0) {
        this.loadingOptions.set(false);
      }
    };

    this.courseService.getAllCourses().subscribe((res) => {
      this.courseOptions.set(
        res.success ? res.data.map((c) => ({ value: c.id, label: c.name })) : [],
      );
      done();
    });
    this.subjectService.getAllSubjects().subscribe((res) => {
      this.subjectOptions.set(
        res.success ? res.data.map((s) => ({ value: s.id, label: s.name })) : [],
      );
      done();
    });
    this.groupService.getAllGroups().subscribe((res) => {
      this.groupOptions.set(
        res.success ? res.data.map((g) => ({ value: g.id, label: g.name })) : [],
      );
      done();
    });
    this.teachersService.getAllTeachers().subscribe((res) => {
      this.teacherOptions.set(
        res.success
          ? res.data.map((t) => ({
              value: t.id,
              label: [t.name, t.surname, t.ndSurname].filter(Boolean).join(' '),
            }))
          : [],
      );
      done();
    });
  }

  /** Configura el preview automático al cambiar filtros válidos. */
  private setupPreviewSubscription(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        filter(() => this.datesValid()),
        switchMap(() => {
          const filters = this.buildFilters();
          if (!filters) {
            this.previewCount.set(null);
            this.previewLoading.set(false);
            return EMPTY;
          }
          this.previewLoading.set(true);
          this.previewError.set(false);
          return this.sessionService.previewSuspend(filters);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (res) => {
          this.previewLoading.set(false);
          if (res.success) {
            this.previewCount.set(res.count);
            this.previewError.set(false);
          } else {
            this.previewCount.set(null);
            this.previewError.set(true);
          }
        },
        error: () => {
          this.previewLoading.set(false);
          this.previewCount.set(null);
          this.previewError.set(true);
        },
      });
  }

  /** Comprueba que el rango de fechas esté completo y ordenado. */
  datesValid(): boolean {
    const { dateFrom, dateTo } = this.form.getRawValue();
    return Boolean(dateFrom && dateTo && dateFrom <= dateTo);
  }

  /** Construye el DTO de filtros omitiendo selectores vacíos. */
  buildFilters(): SessionSuspendFilters | null {
    if (!this.datesValid()) {
      return null;
    }
    const raw = this.form.getRawValue();
    const filters: SessionSuspendFilters = {
      dateFrom: raw.dateFrom!,
      dateTo: raw.dateTo!,
    };
    if (raw.idCourse != null) {
      filters.idCourse = raw.idCourse;
    }
    if (raw.idSubject != null) {
      filters.idSubject = raw.idSubject;
    }
    if (raw.idGroup != null) {
      filters.idGroup = raw.idGroup;
    }
    if (raw.idTeacher != null) {
      filters.idTeacher = raw.idTeacher;
    }
    return filters;
  }

  /** Determina si el botón de confirmación debe estar habilitado. */
  canConfirm(): boolean {
    return (
      this.datesValid() &&
      !this.previewLoading() &&
      !this.previewError() &&
      (this.previewCount() ?? 0) > 0 &&
      !this.isSubmitting()
    );
  }

  /** Cierra el diálogo si no hay una suspensión en curso. */
  onClose(): void {
    if (!this.isSubmitting()) {
      this.closed.emit();
    }
  }

  /** Ejecuta la suspensión masiva usando los filtros validados. */
  onConfirm(): void {
    const filters = this.buildFilters();
    if (!filters || !this.canConfirm()) {
      return;
    }
    this.isSubmitting.set(true);
    this.submitError.set('');
    this.sessionService.suspendByPeriod(filters).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.suspended.emit(res.count);
          this.closed.emit();
        } else {
          this.submitError.set('lists.classSessions.cancelDialog.error');
        }
      },
      error: () => {
        this.isSubmitting.set(false);
        this.submitError.set('lists.classSessions.cancelDialog.error');
      },
    });
  }
}
