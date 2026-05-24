import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { AdminNotificationService } from '../../../../../core/services/admin/entities/admin-notification.service';
import { StudentsService } from '../../../../../core/services/admin/entities/students.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';

/** Roles que administración puede elegir como destinatarios de una notificación manual. */
type RecipientRole = 'STUDENT' | 'TEACHER';

/** Opción del selector de destinatarios, ya preparada con UID y etiqueta legible. */
interface RecipientOption {
  /** UID de Firebase que recibirá la notificación. */
  firebaseUID: string;

  /** Nombre completo y correo mostrados en el selector. */
  label: string;
}

/** Compone una etiqueta humana para alumnos/profesores evitando perder el email. */
function personLabel(
  p: { name: string; surname?: string; ndSurname?: string; email: string },
): string {
  const fullName = [p.name, p.surname, p.ndSurname].filter(Boolean).join(' ');
  return `${fullName} · ${p.email}`;
}

/** Formulario admin para crear una notificación manual a alumnos o profesores. */
@Component({
  selector: 'app-notification-create-form',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './notification-create-form.component.html',
  styleUrl: './notification-create-form.component.scss',
})
export class NotificationCreateFormComponent implements OnInit {
  /** Constructor de formularios reactivos. */
  private readonly fb = inject(FormBuilder);

  /** Servicio CRUD de notificaciones administrativas. */
  private readonly notificationService = inject(AdminNotificationService);

  /** Servicio para cargar alumnos con Firebase UID. */
  private readonly studentsService = inject(StudentsService);

  /** Servicio para cargar profesores con Firebase UID. */
  private readonly teachersService = inject(TeachersService);

  /** Traducciones para errores del backend. */
  private readonly translate = inject(TranslateService);

  /** Cierra el formulario sin crear notificación. */
  readonly cancelCreate = output<void>();

  /** Notifica al listado padre que debe recargar tras una creación correcta. */
  readonly notificationCreated = output<void>();

  /** Destinatarios alumno disponibles en el selector. */
  readonly studentOptions = signal<RecipientOption[]>([]);

  /** Destinatarios profesor disponibles en el selector. */
  readonly teacherOptions = signal<RecipientOption[]>([]);

  /** Indica si todavía se están cargando destinatarios. */
  readonly loadingRecipients = signal(true);

  /** Roles que alimentan el primer selector del formulario. */
  readonly recipientRoles: RecipientRole[] = ['STUDENT', 'TEACHER'];

  /** Formulario validado antes de enviar al endpoint `/notifications`. */
  createForm = this.fb.group({
    recipientRole: ['STUDENT' as RecipientRole, Validators.required],
    recipientFirebaseUID: ['', Validators.required],
    title: ['', Validators.required],
    message: ['', Validators.required],
    type: ['SYSTEM'],
  });

  /** Evita doble envío mientras se crea la notificación. */
  isCreating = false;

  /** Error traducido mostrado en el formulario. */
  errorMessage = '';

  /** Carga alumnos y profesores con UID para construir las opciones del destinatario. */
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

  /** Opciones correspondientes al rol actualmente seleccionado. */
  currentOptions(): RecipientOption[] {
    return this.createForm.get('recipientRole')?.value === 'TEACHER'
      ? this.teacherOptions()
      : this.studentOptions();
  }

  /** Limpia el destinatario al cambiar entre alumnos y profesores. */
  onRecipientRoleChange(): void {
    this.createForm.patchValue({ recipientFirebaseUID: '' });
  }

  /** Valida y envía la notificación manual al backend. */
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
          this.errorMessage = resolveApiError(this.translate, err, 'common.errors.createNotification');
        },
      });
  }

  /** Cancela la creación y devuelve al listado. */
  onCancel(): void {
    this.cancelCreate.emit();
  }
}
