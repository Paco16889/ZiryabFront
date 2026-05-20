import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssistanceStatus } from '../../../../../core/models/assistance';
import { AssistanceService } from '../../../../../core/services/admin/entities/assistance.service';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { EnrollmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/enrollment-http.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-assistance-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './assistance-create-form.component.html',
  styleUrl: './assistance-create-form.component.scss',
})
export class AssistanceCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assistanceService = inject(AssistanceService);
  private readonly sessionService = inject(ClassSessionService);
  private readonly groupService = inject(GroupService);
  private readonly subjectService = inject(SubjectService);
  private readonly enrollmentHttp = inject(EnrollmentHttpService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly assistanceCreated = output<void>();

  readonly sessionOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly enrollmentOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingSessions = signal(true);
  readonly loadingEnrollments = signal(false);

  createForm = this.fb.group({
    idSession: [null as number | null, Validators.required],
    filterGroup: [null as number | null, Validators.required],
    filterSubject: [null as number | null, Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    idStudentEnrollment: [null as number | null, Validators.required],
    status: [AssistanceStatus.PRESENT],
  });

  isCreating = false;
  errorMessage = '';

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
              label:
                [e.student?.name, e.student?.surname].filter(Boolean).join(' ') ||
                this.translate.instant('adminPages.assistance.enrollmentFallback', { id: e.id }),
            }))
          : [],
      );
      this.createForm.patchValue({ idStudentEnrollment: null });
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
          this.errorMessage =
            err.error?.message ??
            this.translate.instant('adminPages.errors.assistanceCreate');
        },
      });
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
