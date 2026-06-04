import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { IssueAudience, IssueCreateRequest } from '../../../../../core/models/issue';
import { Subject } from '../../../../../core/models/subject';
import { AdminIssueService } from '../../../../../core/services/admin/entities/issue.service';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { AssignmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/teacher-assignment-http.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { normalizeGradeValue } from '../../../../../core/utils/week-schedule-assignment-filters';
import { environment } from '../../../../../../environments/environment';

/** Audiencias que el API no permite a profesores. */
const TEACHER_FORBIDDEN_AUDIENCES: IssueAudience[] = ['CENTER', 'ALL_TEACHERS', 'ALL_STUDENTS'];

/** Opciones del desplegable de audiencia en el formulario de alta. */
const CREATE_FORM_AUDIENCES: IssueAudience[] = [
  'CENTER',
  'ALL_TEACHERS',
  'ALL_STUDENTS',
  'TARGETED',
  'ASSIGNMENT',
  'TEACHER',
];

/** Opciones de curso dentro del ciclo para audiencia acotada. */
const GRADE_OPTIONS = [
  { value: '1', labelKey: 'lists.issues.form.gradeOption1' },
  { value: '2', labelKey: 'lists.issues.form.gradeOption2' },
] as const;

/**
 * Formulario de alta de anuncio (patrón task-create-form, CURSO-128).
 */
@Component({
  selector: 'app-issue-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './issue-create-form.component.html',
  styleUrl: './issue-create-form.component.scss',
})
export class IssueCreateFormComponent implements OnInit {
  /** Constructor del formulario reactivo de alta. */
  private readonly fb = inject(FormBuilder);

  /** POST de anuncios en el tablón. */
  private readonly issueService = inject(AdminIssueService);

  /** Rol del usuario para filtrar audiencias del desplegable. */
  private readonly authService = inject(AuthService);

  /** Desplegable de grupos para audiencia TARGETED. */
  private readonly groupService = inject(GroupService);

  /** Desplegable de ciclos para audiencia TARGETED. */
  private readonly courseService = inject(CourseService);

  /** Catálogo de asignaturas para filtros TARGETED. */
  private readonly subjectService = inject(SubjectService);

  /** Desplegable de profesores para audiencia TEACHER. */
  private readonly teachersService = inject(TeachersService);

  /** Asignaciones docentes para audiencia ASSIGNMENT. */
  private readonly assignmentHttp = inject(AssignmentHttpService);

  /** Etiquetas y mensajes de error i18n. */
  private readonly translate = inject(TranslateService);

  /** Cancela el formulario de alta. */
  readonly cancelCreate = output<void>();

  /** Anuncio creado correctamente. */
  readonly issueCreated = output<void>();

  /** Valores de audiencia mostrados en el desplegable (sin globales si es profesor). */
  get audiences(): IssueAudience[] {
    if (this.authService.getUserRole() === 'TEACHER') {
      return CREATE_FORM_AUDIENCES.filter((a) => !TEACHER_FORBIDDEN_AUDIENCES.includes(a));
    }
    return CREATE_FORM_AUDIENCES;
  }

  /** Grades para filtro de audiencia acotada. */
  readonly gradeOptions = GRADE_OPTIONS;

  /** Grupos para filtro TARGETED. */
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);

  /** Ciclos para filtro TARGETED. */
  readonly courseOptions = signal<Array<{ value: number; label: string }>>([]);

  /** Asignaturas filtradas por ciclo/grade. */
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);

  /** Profesores para audiencia TEACHER. */
  readonly teacherOptions = signal<Array<{ value: number; label: string }>>([]);

  /** Asignaciones docentes para audiencia ASSIGNMENT. */
  readonly assignmentOptions = signal<Array<{ value: number; label: string }>>([]);

  /** Carga de desplegables auxiliares. */
  readonly loadingOptions = signal(true);

  /** `true` si TARGETED no tiene ningún filtro rellenado. */
  targetedFilterError = false;

  /** Catálogo completo de asignaturas para filtrar en cliente. */
  private readonly allSubjects = signal<Subject[]>([]);

  /** Catálogo de asignaciones para audiencia ASSIGNMENT. */
  private readonly allAssignments = signal<AssignmentWithIncludes[]>([]);

  /** Formulario reactivo del anuncio y filtros de audiencia. */
  createForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    body: ['', [Validators.required, Validators.maxLength(2000)]],
    audience: ['CENTER' as IssueAudience, Validators.required],
    idGroup: [null as number | null],
    idCourse: [null as number | null],
    grade: ['' as string],
    idSubject: [null as number | null],
    idTeacher: [null as number | null],
    idTeacherAssignment: [null as number | null],
    isPublished: [true],
    publishAt: [''],
    expiresAt: [''],
  });

  /** Petición POST en curso. */
  isCreating = false;

  /** Error devuelto por el API al crear. */
  errorMessage = '';

  /** Carga opciones y suscribe cambios de audiencia/filtros. */
  ngOnInit(): void {
    this.loadSelectOptions();
    this.createForm.get('audience')?.valueChanges.subscribe((audience) => {
      if (audience) {
        this.applyAudienceValidators(audience);
        this.clearUnusedAudienceFields(audience);
        this.targetedFilterError = false;
      }
    });
    const refreshTargeted = () => {
      if (this.needsTargeted()) {
        this.refreshSubjectOptions();
        this.refreshAssignmentOptions();
        this.targetedFilterError = false;
      }
    };
    this.createForm.get('idCourse')?.valueChanges.subscribe(refreshTargeted);
    this.createForm.get('grade')?.valueChanges.subscribe(refreshTargeted);
    this.createForm.get('idGroup')?.valueChanges.subscribe(refreshTargeted);
    this.createForm.get('idSubject')?.valueChanges.subscribe(refreshTargeted);
    this.createForm.get('idTeacher')?.valueChanges.subscribe(() => {
      if (this.needsTargeted() || this.needsAssignment()) {
        this.refreshAssignmentOptions();
        if (this.needsAssignment()) {
          this.createForm.patchValue({ idTeacherAssignment: null }, { emitEvent: false });
        }
      }
    });
    const initialAudience = this.audiences[0] ?? 'TARGETED';
    if (
      this.authService.getUserRole() === 'TEACHER' &&
      TEACHER_FORBIDDEN_AUDIENCES.includes(this.createForm.get('audience')!.value as IssueAudience)
    ) {
      this.createForm.patchValue({ audience: initialAudience });
    }
    this.applyAudienceValidators(this.createForm.get('audience')!.value as IssueAudience);
  }

  /** Audiencia con filtros de ciclo, grade, grupo o asignatura. */
  needsTargeted(): boolean {
    return this.createForm.get('audience')?.value === 'TARGETED';
  }

  /** Audiencia ligada a una asignación docente concreta. */
  needsAssignment(): boolean {
    return this.createForm.get('audience')?.value === 'ASSIGNMENT';
  }

  /** Audiencia dirigida a un profesor. */
  needsTeacher(): boolean {
    return this.createForm.get('audience')?.value === 'TEACHER';
  }

  /** Muestra fecha de publicación programada si no se publica ya. */
  showPublishAt(): boolean {
    return !this.createForm.get('isPublished')?.value;
  }

  /** Clave i18n de la etiqueta de audiencia. */
  audienceLabel(audience: IssueAudience): string {
    return `lists.issues.audience.${audience}`;
  }

  /** Texto del grade para opciones (p. ej. `2º`). */
  gradeDisplay(grade: string): string {
    const normalized = grade.trim();
    if (/^\d+$/.test(normalized)) {
      return `${normalized}º`;
    }
    return grade;
  }

  /** Etiqueta compuesta de asignatura en desplegable TARGETED. */
  subjectOptionLabel(subject: Subject): string {
    const courseName = subject.course?.name?.trim() || '—';
    const grade = this.gradeDisplay(subject.grade ?? '');
    return `${subject.name} · ${courseName} · ${grade}`;
  }

  /** Emite cancelación al listado. */
  onCancel(): void {
    this.cancelCreate.emit();
  }

  /** Valida, construye payload y crea el anuncio. */
  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    if (this.needsTargeted()) {
      const targetedError = this.validateTargetedFilters();
      if (targetedError) {
        this.targetedFilterError = true;
        this.errorMessage = targetedError;
        return;
      }
    }
    this.targetedFilterError = false;
    this.errorMessage = '';

    this.isCreating = true;
    this.errorMessage = '';

    this.issueService.createIssue(this.buildPayload()).subscribe({
      next: () => {
        this.isCreating = false;
        this.issueCreated.emit();
      },
      error: (err) => {
        this.isCreating = false;
        this.errorMessage =
          err.error?.message ??
          this.translate.instant('lists.issues.form.errors.create');
      },
    });
  }

  /** Valida filtros TARGETED según el `audience` que enviará el API. */
  private validateTargetedFilters(): string | null {
    const raw = this.createForm.getRawValue();
    if (!raw.idCourse && !raw.grade && !raw.idGroup && !raw.idSubject) {
      return this.translate.instant('lists.issues.form.validation.targeted');
    }

    const apiAudience = this.resolveTargetedApiAudience(raw);
    if (apiAudience === 'SUBJECT_GROUP' && (raw.idGroup == null || raw.idSubject == null)) {
      return this.translate.instant('lists.issues.form.validation.targetedSubjectGroup');
    }
    if (apiAudience === 'GROUP' && raw.idGroup == null) {
      return this.translate.instant('lists.issues.form.validation.targeted');
    }
    if (apiAudience === 'COURSE' && raw.idCourse == null) {
      return this.translate.instant('lists.issues.form.validation.targeted');
    }
    return null;
  }

  /** Carga grupos, ciclos, asignaturas, profesores y asignaciones. */
  private loadSelectOptions(): void {
    this.loadingOptions.set(true);
    let pending = 5;

    const done = () => {
      pending -= 1;
      if (pending === 0) {
        this.loadingOptions.set(false);
        this.refreshSubjectOptions();
        this.refreshAssignmentOptions();
      }
    };

    this.groupService.getAllGroups().subscribe((res) => {
      this.groupOptions.set(
        res.success ? res.data.map((g) => ({ value: g.id, label: g.name })) : [],
      );
      done();
    });

    this.courseService.getAllCourses().subscribe((res) => {
      this.courseOptions.set(
        res.success ? res.data.map((c) => ({ value: c.id, label: c.name })) : [],
      );
      done();
    });

    this.subjectService.getAllSubjects().subscribe((res) => {
      this.allSubjects.set(res.success ? res.data : []);
      done();
    });

    this.teachersService.getAllTeachers().subscribe((res) => {
      this.teacherOptions.set(
        res.success
          ? res.data.map((t) => ({
              value: t.id,
              label: [t.name, t.surname].filter(Boolean).join(' ').trim() || t.email,
            }))
          : [],
      );
      done();
    });

    this.assignmentHttp.getAll().subscribe((res) => {
      this.allAssignments.set(res.success ? res.data : []);
      done();
    });
  }

  /** Filtra asignaturas según ciclo y grade del formulario. */
  private refreshSubjectOptions(): void {
    if (!this.needsTargeted()) {
      this.subjectOptions.set([]);
      return;
    }

    const idCourse = this.createForm.get('idCourse')?.value;
    const grade = this.createForm.get('grade')?.value;

    let list = this.allSubjects();
    if (idCourse != null) {
      list = list.filter((s) => s.idCourse === idCourse);
    }
    if (grade) {
      const gradeNorm = normalizeGradeValue(String(grade));
      list = list.filter((s) => normalizeGradeValue(s.grade ?? '') === gradeNorm);
    }

    this.subjectOptions.set(
      list.map((s) => ({
        value: s.id,
        label: this.subjectOptionLabel(s),
      })),
    );
  }

  /** Filtra asignaciones por año escolar y profesor opcional. */
  private refreshAssignmentOptions(): void {
    if (!this.needsAssignment()) {
      this.assignmentOptions.set([]);
      return;
    }

    const idTeacher = this.createForm.get('idTeacher')?.value;
    const schoolYear = environment.currentSchoolYear;

    let rows = this.allAssignments().filter((a) => a.schoolYear === schoolYear);

    if (idTeacher != null) {
      rows = rows.filter((a) => a.idTeacher === idTeacher);
    }

    this.assignmentOptions.set(
      rows.map((a) => ({
        value: a.id,
        label: this.assignmentOptionLabel(a),
      })),
    );
  }

  /** Etiqueta de asignación en desplegable ASSIGNMENT. */
  private assignmentOptionLabel(a: AssignmentWithIncludes): string {
    const teacher = [a.teacher?.name, a.teacher?.surname].filter(Boolean).join(' ').trim() || '—';
    const subject = a.subject?.name ?? '—';
    const course = a.subject?.course?.name ?? '—';
    const grade = this.gradeDisplay(a.subject?.grade ?? '');
    const group = a.group?.name ?? '—';
    return `${teacher} · ${subject} · ${course} · ${grade} · ${group}`;
  }

  /** Ajusta validadores según el tipo de audiencia. */
  private applyAudienceValidators(audience: IssueAudience): void {
    const idGroup = this.createForm.get('idGroup');
    const idCourse = this.createForm.get('idCourse');
    const grade = this.createForm.get('grade');
    const idSubject = this.createForm.get('idSubject');
    const idTeacher = this.createForm.get('idTeacher');
    const idTeacherAssignment = this.createForm.get('idTeacherAssignment');

    for (const ctrl of [idGroup, idCourse, grade, idSubject, idTeacher, idTeacherAssignment]) {
      ctrl?.clearValidators();
    }

    if (audience === 'TEACHER') {
      idTeacher?.setValidators(Validators.required);
    } else if (audience === 'ASSIGNMENT') {
      idTeacherAssignment?.setValidators(Validators.required);
    }

    for (const ctrl of [idGroup, idCourse, grade, idSubject, idTeacher, idTeacherAssignment]) {
      ctrl?.updateValueAndValidity();
    }
    this.refreshSubjectOptions();
    this.refreshAssignmentOptions();
  }

  /** Resetea campos que no aplican a la audiencia elegida. */
  private clearUnusedAudienceFields(audience: IssueAudience): void {
    if (audience === 'TARGETED') {
      this.createForm.patchValue({
        idTeacher: null,
        idTeacherAssignment: null,
      });
      this.refreshAssignmentOptions();
      return;
    }

    if (audience === 'ASSIGNMENT') {
      this.createForm.patchValue({
        idGroup: null,
        idCourse: null,
        grade: '',
        idSubject: null,
        idTeacherAssignment: null,
      });
      this.refreshAssignmentOptions();
      return;
    }

    if (audience === 'TEACHER') {
      this.createForm.patchValue({
        idGroup: null,
        idCourse: null,
        grade: '',
        idSubject: null,
        idTeacherAssignment: null,
      });
      return;
    }

    this.createForm.patchValue({
      idGroup: null,
      idCourse: null,
      grade: '',
      idSubject: null,
      idTeacher: null,
      idTeacherAssignment: null,
    });
    this.refreshSubjectOptions();
    this.refreshAssignmentOptions();
  }

  /** Mapea filtros combinados al `audience` que entiende el API hoy. */
  private resolveTargetedApiAudience(raw: ReturnType<typeof this.createForm.getRawValue>): IssueAudience {
    if (raw.idSubject) {
      return 'SUBJECT_GROUP';
    }
    if (raw.idGroup && !raw.idCourse && !raw.grade) {
      return 'GROUP';
    }
    if (raw.idCourse && raw.grade && !raw.idGroup && !raw.idSubject) {
      return 'COURSE';
    }
    return 'SUBJECT_GROUP';
  }

  /** Copia solo los FK que admite cada audiencia del API. */
  private attachTargetedFields(
    payload: IssueCreateRequest,
    raw: ReturnType<typeof this.createForm.getRawValue>,
  ): void {
    const apiAudience = payload.audience;

    if (apiAudience === 'SUBJECT_GROUP') {
      payload.idGroup = raw.idGroup ?? undefined;
      payload.idSubject = raw.idSubject ?? undefined;
      return;
    }

    if (apiAudience === 'GROUP') {
      payload.idGroup = raw.idGroup ?? undefined;
      return;
    }

    if (apiAudience === 'COURSE') {
      payload.idCourse = raw.idCourse ?? undefined;
      if (raw.grade) {
        payload.grade = raw.grade;
      }
    }
  }

  /** ASSIGNMENT del formulario → SUBJECT_GROUP en el API (idGroup + idSubject). */
  private attachAssignmentFields(
    payload: IssueCreateRequest,
    raw: ReturnType<typeof this.createForm.getRawValue>,
  ): void {
    if (raw.idTeacherAssignment == null) {
      return;
    }
    const selected = this.allAssignments().find((a) => a.id === raw.idTeacherAssignment);
    if (!selected) {
      return;
    }
    payload.audience = 'SUBJECT_GROUP';
    payload.idGroup = selected.idGroup;
    payload.idSubject = selected.idSubject;
  }

  /** Construye el cuerpo de `POST /api/issues`. */
  private buildPayload(): IssueCreateRequest {
    const raw = this.createForm.getRawValue();
    const formAudience = raw.audience as IssueAudience;

    const payload: IssueCreateRequest = {
      title: (raw.title as string).trim(),
      body: (raw.body as string).trim(),
      audience: formAudience,
      isPublished: !!raw.isPublished,
      expiresAt: raw.expiresAt || undefined,
    };

    if (!payload.isPublished && raw.publishAt) {
      payload.publishAt = raw.publishAt;
    }

    if (formAudience === 'TARGETED') {
      payload.audience = this.resolveTargetedApiAudience(raw);
      this.attachTargetedFields(payload, raw);
    } else if (formAudience === 'ASSIGNMENT') {
      this.attachAssignmentFields(payload, raw);
    } else if (formAudience === 'TEACHER') {
      payload.audience = 'TEACHER';
      payload.idTeacher = raw.idTeacher ?? undefined;
    }

    return payload;
  }
}
