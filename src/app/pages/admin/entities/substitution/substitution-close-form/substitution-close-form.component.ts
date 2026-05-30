import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentSubstitution } from '../../../../../core/models/assignment-substitution';
import { AssignmentSubstitutionsService } from '../../../../../core/services/admin/entities/assignment-substitutions.service';
/**
 * Cierre de sustitución activa (`PATCH .../close`). De momento: selector + fecha fin.
 */
@Component({
  selector: 'app-substitution-close-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './substitution-close-form.component.html',
})
export class SubstitutionCloseFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly substitutionService = inject(AssignmentSubstitutionsService);

  readonly cancelClose = output<void>();
  readonly substitutionClosed = output<void>();

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly activeSubstitutions = computed(() =>
    this.substitutionService.substitutions().filter((s) => s.endDate == null),
  );

  readonly form = this.fb.group({
    idSubstitution: [null as number | null, Validators.required],
    endDate: [this.todayIso(), Validators.required],
  });

  substitutionLabel(item: AssignmentSubstitution): string {
    const titular = item.teacherAssignment?.teacher;
    const sub = item.substitute;
    const titularName = titular
      ? `${titular.name} ${titular.surname ?? ''}`.trim()
      : `#${item.idTeacherAssignment}`;
    const subName = sub ? `${sub.name} ${sub.surname ?? ''}`.trim() : `#${item.idSubstitute}`;
    const subject = item.teacherAssignment?.subject?.name ?? '—';
    return `${titularName} → ${subName} (${subject})`;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.form.value.idSubstitution!;
    const endDate = this.form.value.endDate!;
    this.saving.set(true);
    this.errorMessage.set(null);

    this.substitutionService.close(id, { endDate: `${endDate}T23:59:59.000Z` }).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (!res.success) {
          this.errorMessage.set('lists.substitutions.closeError');
          return;
        }
        this.substitutionClosed.emit();
      },
      error: (err) => {
        this.saving.set(false);
        const msg = err?.error?.message;
        this.errorMessage.set(typeof msg === 'string' ? msg : 'lists.substitutions.closeError');
      },
    });
  }

  private todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }
}
