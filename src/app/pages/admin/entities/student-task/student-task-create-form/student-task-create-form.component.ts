import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { SubmissionStatus } from '../../../../../core/models/studentTask';
import { AdminTaskService } from '../../../../../core/services/admin/entities/task.service';
import { StudentTaskService } from '../../../../../core/services/admin/entities/student-task.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { EnrollmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/enrollment-http.service';
import { environment } from '../../../../../../environments/environment';

/** Formulario admin para crear una entrega individual asociada a una tarea y matrícula. */
@Component({
  selector: 'app-student-task-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './student-task-create-form.component.html',
  styleUrl: './student-task-create-form.component.scss',
})
export class StudentTaskCreateFormComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);
  /** Servicio CRUD admin de StudentTasks. */
  private readonly studentTaskService = inject(StudentTaskService);
  /** Traducciones de errores del backend. */
  private readonly translate = inject(TranslateService);
  /** Servicio de tareas para poblar el selector de tarea. */
  private readonly taskService = inject(AdminTaskService);
  /** Catálogo de grupos para filtrar matrículas. */
  private readonly groupService = inject(GroupService);
  /** Catálogo de asignaturas para filtrar matrículas. */
  private readonly subjectService = inject(SubjectService);
  /** Cliente de matrículas por filtros. */
  private readonly enrollmentHttp = inject(EnrollmentHttpService);
  /** Cancela la creación y vuelve al listado. */
  readonly cancelCreate = output<void>();
  /** Notifica al listado que debe recargar tras crear. */
  readonly studentTaskCreated = output<void>();

  /** Tareas disponibles. */
  readonly taskOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Grupos disponibles para filtrar alumnos. */
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Asignaturas disponibles para filtrar alumnos. */
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Matrículas filtradas para elegir alumno destinatario. */
  readonly enrollmentOptions = signal<Array<{ value: number; label: string }>>([]);
  /** Estado de carga de tareas. */
  readonly loadingTasks = signal(true);
  /** Estado de carga de matrículas. */
  readonly loadingEnrollments = signal(false);

  /** Formulario de creación con tarea, matrícula, estado inicial y habilitación. */
  createForm = this.fb.group({
    idTask: [null as number | null, Validators.required],
    filterGroup: [null as number | null, Validators.required],
    filterSubject: [null as number | null, Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    idStudentEnrollment: [null as number | null, Validators.required],
    status: [SubmissionStatus.PENDING],
    isEnabled: [true],
  });

  /** Evita doble envío durante la creación. */
  isCreating = false;
  /** Error traducido mostrado en el formulario. */
  errorMessage = '';

  /** Carga tareas, grupos y asignaturas para montar el formulario. */
  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe((res) => {
      this.loadingTasks.set(false);
      this.taskOptions.set(
        res.success
          ? res.data.map((t) => ({ value: t.id, label: t.title }))
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

  /** Carga matrículas que coinciden con grupo, asignatura y curso escolar. */
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

  /** Valida y crea la StudentTask individual. */
  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }
    const raw = this.createForm.getRawValue();
    this.isCreating = true;
    this.errorMessage = '';

    this.studentTaskService
      .createStudentTask({
        idTask: raw.idTask as number,
        idStudentEnrollment: raw.idStudentEnrollment as number,
        isEnabled: raw.isEnabled ?? true,
        status: raw.status as SubmissionStatus,
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.studentTaskCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createEnrollment');
        },
      });
  }

  /** Cancela el formulario sin crear entrega. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
