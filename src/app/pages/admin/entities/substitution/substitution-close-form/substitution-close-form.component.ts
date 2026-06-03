import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, concatMap, from, map, of, toArray } from 'rxjs';
import { AssignmentSubstitution } from '../../../../../core/models/assignment-substitution';
import { AssignmentSubstitutionsService } from '../../../../../core/services/admin/entities/assignment-substitutions.service';

interface TitularCloseOption {
  id: number;
  label: string;
}

/**
 * Cierre de sustitución activa (`PATCH .../close`).
 * Selector por profesor titular (sin repetir); cierra todas sus sustituciones activas.
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

  /** Un ítem por titular: «Titular → Sustituto», sin repetir por impartición. */
  readonly titularCloseOptions = computed(() => this.distinctTitularOptions());

  readonly form = this.fb.group({
    idTitular: [null as number | null, Validators.required],
    endDate: [this.todayIso(), Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const titularId = this.form.value.idTitular!;
    const endDate = `${this.form.value.endDate!}T23:59:59.000Z`;
    const toClose = this.activeSubstitutionsForTitular(titularId);
    if (toClose.length === 0) {
      this.errorMessage.set('lists.substitutions.closeError');
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    from(toClose)
      .pipe(
        concatMap((s) =>
          this.substitutionService.close(s.id, { endDate }).pipe(
            map((res) => ({ ok: res.success })),
            catchError(() => of({ ok: false })),
          ),
        ),
        toArray(),
      )
      .subscribe({
        next: (results) => {
          this.saving.set(false);
          const ok = results.filter((r) => r.ok).length;
          if (ok === results.length) {
            this.substitutionClosed.emit();
            return;
          }
          if (ok > 0) {
            this.substitutionService.loadSubstitutions();
          }
          this.errorMessage.set('lists.substitutions.closeError');
        },
        error: (err) => {
          this.saving.set(false);
          const msg = err?.error?.message;
          this.errorMessage.set(typeof msg === 'string' ? msg : 'lists.substitutions.closeError');
        },
      });
  }

  private activeSubstitutionsForTitular(titularId: number): AssignmentSubstitution[] {
    return this.activeSubstitutions().filter((s) => this.titularIdOf(s) === titularId);
  }

  private distinctTitularOptions(): TitularCloseOption[] {
    const byTitularId = new Map<number, string>();
    for (const s of this.activeSubstitutions()) {
      const id = this.titularIdOf(s);
      if (id == null || byTitularId.has(id)) {
        continue;
      }
      byTitularId.set(id, this.substitutionCloseLabel(s));
    }
    return [...byTitularId.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  /** Titular → sustituto (solo nombres, sin asignatura por impartición). */
  private substitutionCloseLabel(item: AssignmentSubstitution): string {
    const titular = item.teacherAssignment?.teacher;
    const sub = item.substitute;
    const titularName = titular
      ? this.teacherLabel(titular.name, titular.surname)
      : `#${item.idTeacherAssignment}`;
    const subName = sub ? this.teacherLabel(sub.name, sub.surname) : `#${item.idSubstitute}`;
    return `${titularName} → ${subName}`;
  }

  private titularIdOf(s: AssignmentSubstitution): number | undefined {
    return s.teacherAssignment?.teacher?.id ?? s.teacherAssignment?.idTeacher;
  }

  private teacherLabel(name: string, surname?: string): string {
    return `${name} ${surname ?? ''}`.trim();
  }

  private todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }
}
