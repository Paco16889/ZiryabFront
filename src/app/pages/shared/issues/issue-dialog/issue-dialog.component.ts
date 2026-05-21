import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Issue, IssueAudience, IssueCreateRequest } from '../../../../core/models/issue';
import { CourseService } from '../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../core/services/admin/entities/subject.service';
import { IssueService, IssueUpdatePayload } from '../../../../core/services/issue.service';

const ISSUE_AUDIENCES: IssueAudience[] = [
  'CENTER',
  'ALL_TEACHERS',
  'ALL_STUDENTS',
  'GROUP',
  'COURSE',
  'SUBJECT_GROUP',
];

const URL_PATTERN = /^https?:\/\/.+/i;

/**
 * Diálogo overlay para crear y editar anuncios del tablón (CURSO-128).
 */
@Component({
  selector: 'app-issue-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './issue-dialog.component.html',
  styleUrl: './issue-dialog.component.scss',
})
export class IssueDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(IssueService);
  private readonly groupService = inject(GroupService);
  private readonly courseService = inject(CourseService);
  private readonly subjectService = inject(SubjectService);
  private readonly translate = inject(TranslateService);

  mode = input.required<'create' | 'edit'>();
  issue = input<Issue | null>(null);

  closed = output<void>();
  saved = output<void>();

  readonly audiences = ISSUE_AUDIENCES;
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly courseOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingOptions = signal(true);

  isSaving = false;
  errorMessage = '';

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    body: ['', [Validators.required, Validators.maxLength(2000)]],
    audience: ['CENTER' as IssueAudience, Validators.required],
    idGroup: [null as number | null],
    idCourse: [null as number | null],
    idSubject: [null as number | null],
    attachmentUrl: [''],
    isPublished: [true],
    publishAt: [''],
    expiresAt: [''],
  });

  constructor() {
    effect(() => {
      const item = this.issue();
      if (this.mode() === 'edit' && item) {
        this.form.patchValue({
          title: item.title,
          body: item.body,
          audience: item.audience,
          idGroup: item.idGroup ?? null,
          idCourse: item.idCourse ?? null,
          idSubject: item.idSubject ?? null,
          attachmentUrl: item.attachmentUrl ?? '',
          isPublished: item.isPublished,
          publishAt: this.toDateInput(item.publishAt),
          expiresAt: this.toDateInput(item.expiresAt),
        });
        this.applyAudienceValidators(item.audience);
      }
    });
  }

  ngOnInit(): void {
    this.loadSelectOptions();
    this.form.get('audience')?.valueChanges.subscribe((audience) => {
      if (audience) {
        this.applyAudienceValidators(audience);
        this.clearUnusedAudienceFields(audience);
      }
    });
    if (this.mode() === 'create') {
      this.applyAudienceValidators(this.form.get('audience')!.value as IssueAudience);
    }
  }

  needsGroup(): boolean {
    const a = this.form.get('audience')?.value;
    return a === 'GROUP' || a === 'SUBJECT_GROUP';
  }

  needsCourse(): boolean {
    return this.form.get('audience')?.value === 'COURSE';
  }

  needsSubject(): boolean {
    return this.form.get('audience')?.value === 'SUBJECT_GROUP';
  }

  showPublishAt(): boolean {
    return !this.form.get('isPublished')?.value;
  }

  audienceLabel(audience: IssueAudience): string {
    return `lists.issues.audience.${audience}`;
  }

  onClose(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const attachment = this.form.get('attachmentUrl')?.value?.trim();
    if (attachment && !URL_PATTERN.test(attachment)) {
      this.form.get('attachmentUrl')?.setErrors({ pattern: true });
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const payload = this.buildPayload();

    if (this.mode() === 'create') {
      this.issueService.createIssue(payload).subscribe({
        next: () => {
          this.isSaving = false;
          this.saved.emit();
        },
        error: (err) => {
          this.isSaving = false;
          this.errorMessage =
            err.error?.message ??
            this.translate.instant('lists.issues.form.errors.create');
        },
      });
      return;
    }

    const item = this.issue();
    if (!item) {
      this.isSaving = false;
      return;
    }

    const updatePayload: IssueUpdatePayload = { id: item.id, ...payload };
    this.issueService.updateIssue(updatePayload).subscribe({
      next: () => {
        this.isSaving = false;
        this.saved.emit();
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage =
          err.error?.message ??
          this.translate.instant('lists.issues.form.errors.update');
      },
    });
  }

  private loadSelectOptions(): void {
    this.loadingOptions.set(true);
    let pending = 3;

    const done = () => {
      pending -= 1;
      if (pending === 0) {
        this.loadingOptions.set(false);
      }
    };

    this.groupService.getAllGroups().subscribe((res) => {
      this.groupOptions.set(
        res.success
          ? res.data.map((g) => ({ value: g.id, label: g.name }))
          : [],
      );
      done();
    });

    this.courseService.getAllCourses().subscribe((res) => {
      this.courseOptions.set(
        res.success
          ? res.data.map((c) => ({ value: c.id, label: c.name }))
          : [],
      );
      done();
    });

    this.subjectService.getAllSubjects().subscribe((res) => {
      this.subjectOptions.set(
        res.success
          ? res.data.map((s) => ({ value: s.id, label: s.name }))
          : [],
      );
      done();
    });
  }

  private applyAudienceValidators(audience: IssueAudience): void {
    const idGroup = this.form.get('idGroup');
    const idCourse = this.form.get('idCourse');
    const idSubject = this.form.get('idSubject');

    idGroup?.clearValidators();
    idCourse?.clearValidators();
    idSubject?.clearValidators();

    if (audience === 'GROUP' || audience === 'SUBJECT_GROUP') {
      idGroup?.setValidators(Validators.required);
    }
    if (audience === 'COURSE') {
      idCourse?.setValidators(Validators.required);
    }
    if (audience === 'SUBJECT_GROUP') {
      idSubject?.setValidators(Validators.required);
    }

    idGroup?.updateValueAndValidity();
    idCourse?.updateValueAndValidity();
    idSubject?.updateValueAndValidity();
  }

  private clearUnusedAudienceFields(audience: IssueAudience): void {
    if (audience !== 'GROUP' && audience !== 'SUBJECT_GROUP') {
      this.form.patchValue({ idGroup: null });
    }
    if (audience !== 'COURSE') {
      this.form.patchValue({ idCourse: null });
    }
    if (audience !== 'SUBJECT_GROUP') {
      this.form.patchValue({ idSubject: null });
    }
  }

  private buildPayload(): IssueCreateRequest {
    const raw = this.form.getRawValue();
    const audience = raw.audience as IssueAudience;
    const attachmentUrl = raw.attachmentUrl?.trim();

    const payload: IssueCreateRequest = {
      title: (raw.title as string).trim(),
      body: (raw.body as string).trim(),
      audience,
      isPublished: !!raw.isPublished,
      attachmentUrl: attachmentUrl || undefined,
      expiresAt: raw.expiresAt || undefined,
    };

    if (!payload.isPublished && raw.publishAt) {
      payload.publishAt = raw.publishAt;
    }

    if (audience === 'GROUP' || audience === 'SUBJECT_GROUP') {
      payload.idGroup = raw.idGroup ?? undefined;
    }
    if (audience === 'COURSE') {
      payload.idCourse = raw.idCourse ?? undefined;
    }
    if (audience === 'SUBJECT_GROUP') {
      payload.idSubject = raw.idSubject ?? undefined;
    }

    return payload;
  }

  private toDateInput(value?: string | null): string {
    if (!value) {
      return '';
    }
    return value.split('T')[0];
  }
}
