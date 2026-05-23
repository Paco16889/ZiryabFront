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
import { normalizeGradeValue } from '../../../../../core/utils/week-schedule-assignment-filters';
import { environment } from '../../../../../../environments/environment';

/** Opciones del desplegable de audiencia en el formulario de alta. */
const CREATE_FORM_AUDIENCES: IssueAudience[] = [
  'CENTER',
  'ALL_TEACHERS',
  'ALL_STUDENTS',
  'TARGETED',
  'ASSIGNMENT',
  'TEACHER',
];

const URL_PATTERN = /^https?:\/\/.+/i;

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
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(AdminIssueService);
  private readonly groupService = inject(GroupService);
  private readonly courseService = inject(CourseService);
  private readonly subjectService = inject(SubjectService);
  private readonly teachersService = inject(TeachersService);
  private readonly assignmentHttp = inject(AssignmentHttpService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly issueCreated = output<void>();

  readonly audiences = CREATE_FORM_AUDIENCES;
  readonly gradeOptions = GRADE_OPTIONS;
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly courseOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly teacherOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly assignmentOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingOptions = signal(true);

  targetedFilterError = false;

  private readonly allSubjects = signal<Subject[]>([]);
  private readonly allAssignments = signal<AssignmentWithIncludes[]>([]);

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
    attachmentUrl: [''],
    isPublished: [true],
    publishAt: [''],
    expiresAt: [''],
  });

  isCreating = false;
  errorMessage = '';

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
    this.applyAudienceValidators(this.createForm.get('audience')!.value as IssueAudience);
  }

  needsTargeted(): boolean {
    return this.createForm.get('audience')?.value === 'TARGETED';
  }

  needsAssignment(): boolean {
    return this.createForm.get('audience')?.value === 'ASSIGNMENT';
  }

  needsTeacher(): boolean {
    return this.createForm.get('audience')?.value === 'TEACHER';
  }

  showPublishAt(): boolean {
    return !this.createForm.get('isPublished')?.value;
  }

  audienceLabel(audience: IssueAudience): string {
    return `lists.issues.audience.${audience}`;
  }

  gradeDisplay(grade: string): string {
    const normalized = grade.trim();
    if (/^\d+$/.test(normalized)) {
      return `${normalized}º`;
    }
    return grade;
  }

  subjectOptionLabel(subject: Subject): string {
    const courseName = subject.course?.name?.trim() || '—';
    const grade = this.gradeDisplay(subject.grade ?? '');
    return `${subject.name} · ${courseName} · ${grade}`;
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    if (this.needsTargeted() && !this.hasAtLeastOneTargetedFilter()) {
      this.targetedFilterError = true;
      return;
    }
    this.targetedFilterError = false;

    const attachment = this.createForm.get('attachmentUrl')?.value?.trim();
    if (attachment && !URL_PATTERN.test(attachment)) {
      this.createForm.get('attachmentUrl')?.setErrors({ pattern: true });
      this.createForm.markAllAsTouched();
      return;
    }

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

  private hasAtLeastOneTargetedFilter(): boolean {
    const raw = this.createForm.getRawValue();
    return !!(raw.idCourse || raw.grade || raw.idGroup || raw.idSubject);
  }

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

  private assignmentOptionLabel(a: AssignmentWithIncludes): string {
    const teacher = [a.teacher?.name, a.teacher?.surname].filter(Boolean).join(' ').trim() || '—';
    const subject = a.subject?.name ?? '—';
    const course = a.subject?.course?.name ?? '—';
    const grade = this.gradeDisplay(a.subject?.grade ?? '');
    const group = a.group?.name ?? '—';
    return `${teacher} · ${subject} · ${course} · ${grade} · ${group}`;
  }

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

  private attachTargetedFields(
    payload: IssueCreateRequest,
    raw: ReturnType<typeof this.createForm.getRawValue>,
  ): void {
    if (raw.idCourse != null) {
      payload.idCourse = raw.idCourse;
    }
    if (raw.grade) {
      payload.grade = raw.grade;
    }
    if (raw.idGroup != null) {
      payload.idGroup = raw.idGroup;
    }
    if (raw.idSubject != null) {
      payload.idSubject = raw.idSubject;
    }
  }

  private attachAssignmentFields(
    payload: IssueCreateRequest,
    raw: ReturnType<typeof this.createForm.getRawValue>,
  ): void {
    if (raw.idTeacherAssignment == null) {
      return;
    }
    payload.idTeacherAssignment = raw.idTeacherAssignment;
    const selected = this.allAssignments().find((a) => a.id === raw.idTeacherAssignment);
    if (selected) {
      payload.idTeacher = selected.idTeacher;
      payload.idGroup = selected.idGroup;
      payload.idSubject = selected.idSubject;
      if (selected.subject?.course?.id) {
        payload.idCourse = selected.subject.course.id;
      }
      if (selected.subject?.grade) {
        payload.grade = selected.subject.grade;
      }
    } else if (raw.idTeacher != null) {
      payload.idTeacher = raw.idTeacher;
    }
  }

  private buildPayload(): IssueCreateRequest {
    const raw = this.createForm.getRawValue();
    const formAudience = raw.audience as IssueAudience;
    const attachmentUrl = raw.attachmentUrl?.trim();

    const payload: IssueCreateRequest = {
      title: (raw.title as string).trim(),
      body: (raw.body as string).trim(),
      audience: formAudience,
      isPublished: !!raw.isPublished,
      attachmentUrl: attachmentUrl || undefined,
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
      payload.idTeacher = raw.idTeacher ?? undefined;
    }

    return payload;
  }
}
