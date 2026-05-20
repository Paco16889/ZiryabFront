import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubmissionStatus } from '../../../../../core/models/studentTask';
import { AdminTaskService } from '../../../../../core/services/admin/entities/task.service';
import { StudentTaskService } from '../../../../../core/services/admin/entities/student-task.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { EnrollmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/enrollment-http.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-student-task-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './student-task-create-form.component.html',
  styleUrl: './student-task-create-form.component.scss',
})
export class StudentTaskCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly studentTaskService = inject(StudentTaskService);
  private readonly taskService = inject(AdminTaskService);
  private readonly groupService = inject(GroupService);
  private readonly subjectService = inject(SubjectService);
  private readonly enrollmentHttp = inject(EnrollmentHttpService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly studentTaskCreated = output<void>();

  readonly taskOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly groupOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly subjectOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly enrollmentOptions = signal<Array<{ value: number; label: string }>>([]);
  readonly loadingTasks = signal(true);
  readonly loadingEnrollments = signal(false);

  createForm = this.fb.group({
    idTask: [null as number | null, Validators.required],
    filterGroup: [null as number | null, Validators.required],
    filterSubject: [null as number | null, Validators.required],
    schoolYear: [environment.currentSchoolYear, Validators.required],
    idStudentEnrollment: [null as number | null, Validators.required],
    status: [SubmissionStatus.PENDING],
    isEnabled: [true],
  });

  isCreating = false;
  errorMessage = '';

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
          this.errorMessage =
            err.error?.message ??
            this.translate.instant('adminPages.errors.studentTaskCreate');
        },
      });
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
