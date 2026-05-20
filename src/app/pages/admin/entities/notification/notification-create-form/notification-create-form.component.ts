import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdminNotificationService } from '../../../../../core/services/admin/entities/admin-notification.service';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';

type RecipientRole = 'STUDENT' | 'TEACHER';

interface RecipientOption {
  firebaseUID: string;
  label: string;
}

function personLabel(
  p: { name: string; surname?: string; ndSurname?: string; email: string },
): string {
  const fullName = [p.name, p.surname, p.ndSurname].filter(Boolean).join(' ');
  return `${fullName} · ${p.email}`;
}

@Component({
  selector: 'app-notification-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './notification-create-form.component.html',
  styleUrl: './notification-create-form.component.scss',
})
export class NotificationCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(AdminNotificationService);
  private readonly studentsService = inject(StudentsService);
  private readonly teachersService = inject(TeachersService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly notificationCreated = output<void>();

  readonly studentOptions = signal<RecipientOption[]>([]);
  readonly teacherOptions = signal<RecipientOption[]>([]);
  readonly loadingRecipients = signal(true);

  readonly recipientRoles: RecipientRole[] = ['STUDENT', 'TEACHER'];

  createForm = this.fb.group({
    recipientRole: ['STUDENT' as RecipientRole, Validators.required],
    recipientFirebaseUID: ['', Validators.required],
    title: ['', Validators.required],
    message: ['', Validators.required],
    type: ['SYSTEM'],
  });

  isCreating = false;
  errorMessage = '';

  ngOnInit(): void {
    this.studentsService.getAllStudents().subscribe((res) => {
      this.studentOptions.set(
        res.success
          ? res.data
              .filter((s) => s.firebaseUID?.trim())
              .map((s) => ({ firebaseUID: s.firebaseUID, label: personLabel(s) }))
          : [],
      );
      this.loadingRecipients.set(false);
    });
    this.teachersService.getAllTeachers().subscribe((res) => {
      this.teacherOptions.set(
        res.success
          ? res.data
              .filter((t) => t.firebaseUID?.trim())
              .map((t) => ({ firebaseUID: t.firebaseUID, label: personLabel(t) }))
          : [],
      );
    });
  }

  currentOptions(): RecipientOption[] {
    return this.createForm.get('recipientRole')?.value === 'TEACHER'
      ? this.teacherOptions()
      : this.studentOptions();
  }

  onRecipientRoleChange(): void {
    this.createForm.patchValue({ recipientFirebaseUID: '' });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const raw = this.createForm.getRawValue();
    this.isCreating = true;
    this.errorMessage = '';

    this.notificationService
      .create({
        recipientFirebaseUID: (raw.recipientFirebaseUID as string).trim(),
        title: (raw.title as string).trim(),
        message: (raw.message as string).trim(),
        type: (raw.type as string).trim() || 'SYSTEM',
      })
      .subscribe({
        next: () => {
          this.isCreating = false;
          this.notificationCreated.emit();
        },
        error: (err) => {
          this.isCreating = false;
          this.errorMessage =
            err.error?.message ??
            this.translate.instant('adminPages.errors.notificationCreate');
        },
      });
  }

  onCancel(): void {
    this.cancelCreate.emit();
  }
}
