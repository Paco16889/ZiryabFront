import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, concatMap, forkJoin, from, map, of, toArray } from 'rxjs';
import { AssignmentSubstitution } from '../../../../../core/models/assignment-substitution';
import { AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { resolveApiError } from '../../../../../core/i18n/api-error.util';
import { AssignmentSubstitutionsService } from '../../../../../core/services/admin/entities/assignment-substitutions.service';
import { AssignmentHttpService } from '../../../../../core/services/admin/entities/services-for-week-schedule/teacher-assignment-http.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import {
  assignmentOptionLabel,
  assignmentToFilterSource,
  assignmentsForCurrentSchoolYear,
  coursesFromFilterSources,
  gradesFromFilterSources,
  groupsFromFilterSources,
  matchesAssignmentFilters,
} from '../../../../../core/utils/assignment-filter-options.util';
import { environment } from '../../../../../../environments/environment';
import {
  isEligibleSubstituteTeacher,
  teacherOwnLoadFromAssignments,
} from '../../../../../core/utils/substitute-eligibility.util';
import { CourseGroupGradeFiltersComponent } from '../../../shared/course-group-grade-filters/course-group-grade-filters.component';

interface TeacherOption {
  id: number;
  label: string;
}

/**
 * Alta por profesor titular: filtros ayudan a localizarlo; POST por cada assignment del año.
 */
@Component({
  selector: 'app-substitution-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, CourseGroupGradeFiltersComponent],
  templateUrl: './substitution-create-form.component.html',
})
export class SubstitutionCreateFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assignmentHttp = inject(AssignmentHttpService);
  private readonly substitutionService = inject(AssignmentSubstitutionsService);
  private readonly teachersService = inject(TeachersService);
  private readonly translate = inject(TranslateService);

  readonly cancelCreate = output<void>();
  readonly substitutionCreated = output<void>();

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly bulkSummary = signal<string | null>(null);

  readonly allAssignments = signal<AssignmentWithIncludes[]>([]);
  readonly activeSubstitutions = signal<AssignmentSubstitution[]>([]);
  readonly activeAssignmentIds = signal<Set<number>>(new Set());
  readonly allTeachers = signal<TeacherOption[]>([]);

  readonly selectedCourseId = signal<number | null>(null);
  readonly selectedGroupId = signal<number | null>(null);
  readonly selectedGrade = signal<string | null>(null);
  readonly selectedTitularId = signal<number | null>(null);

  readonly form = this.fb.group({
    idTitular: [null as number | null, Validators.required],
    idSubstitute: [null as number | null, Validators.required],
    startDate: [this.todayIso()],
    notes: [''],
  });

  readonly eligibleAssignments = computed(() => {
    const active = this.activeAssignmentIds();
    return this.allAssignments().filter((a) => !active.has(a.id));
  });

  private readonly filterSources = computed(() =>
    this.eligibleAssignments()
      .map((a) => assignmentToFilterSource(a))
      .filter((s): s is NonNullable<ReturnType<typeof assignmentToFilterSource>> => s != null),
  );

  readonly courses = computed(() => coursesFromFilterSources(this.filterSources()));

  readonly groups = computed(() =>
    groupsFromFilterSources(this.filterSources(), this.selectedCourseId()),
  );

  readonly grades = computed(() =>
    gradesFromFilterSources(this.filterSources(), this.selectedCourseId()),
  );

  /** Assignments que cumplen filtros ciclo/grupo/curso (ayuda a encontrar titular). */
  readonly assignmentsMatchingFilters = computed(() =>
    this.eligibleAssignments().filter((a) => {
      const src = assignmentToFilterSource(a);
      if (!src) {
        return false;
      }
      return matchesAssignmentFilters(src, {
        courseId: this.selectedCourseId(),
        groupId: this.selectedGroupId(),
        grade: this.selectedGrade(),
      });
    }),
  );

  /** Profesores titulares distintos dentro del resultado del filtro. */
  readonly titularTeacherOptions = computed(() =>
    this.distinctTeachersFromAssignments(this.assignmentsMatchingFilters()),
  );

  /** Todas las imparticiones del titular elegido (año actual, sin sustitución activa). */
  readonly titularAssignments = computed(() => {
    const titularId = this.selectedTitularId();
    if (titularId == null) {
      return [];
    }
    return this.eligibleAssignments().filter((a) => a.idTeacher === titularId);
  });

  readonly substituteEligibility = environment.substituteEligibility;

  readonly substituteTeacherOptions = computed(() => {
    const titularId = this.selectedTitularId();
    const schoolYear = environment.currentSchoolYear;
    const thresholds = this.substituteEligibility;
    const assignments = this.allAssignments();
    const activeSubs = this.activeSubstitutions();

    return this.allTeachers()
      .filter((t) =>
        isEligibleSubstituteTeacher(
          t.id,
          assignments,
          activeSubs,
          schoolYear,
          titularId,
          thresholds,
        ),
      )
      .map((t) => ({
        id: t.id,
        label: this.substituteOptionLabel(t.id, t.label, assignments, activeSubs, schoolYear),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  });

  ngOnInit(): void {
    this.loadData();
    this.teachersService.getAllTeachers().subscribe((res) => {
      this.allTeachers.set(
        res.success
          ? res.data.map((t) => ({ id: t.id, label: this.teacherLabel(t.name, t.surname) }))
          : [],
      );
    });

    this.form.get('idTitular')?.valueChanges.subscribe((id) => this.onTitularChange(id));
  }

  assignmentLabel(a: AssignmentWithIncludes): string {
    return assignmentOptionLabel(a);
  }

  onTitularChange(titularId: number | null): void {
    this.selectedTitularId.set(titularId);
    this.form.patchValue({ idSubstitute: null });
    this.errorMessage.set(null);
    this.bulkSummary.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const assignments = this.titularAssignments();
    if (assignments.length === 0) {
      this.errorMessage.set('lists.substitutions.noAssignmentsForTitular');
      return;
    }

    const v = this.form.getRawValue();
    const startDate = v.startDate ? `${v.startDate}T00:00:00.000Z` : undefined;
    const notes = v.notes?.trim() || undefined;
    const idSubstitute = v.idSubstitute!;

    this.saving.set(true);
    this.errorMessage.set(null);
    this.bulkSummary.set(null);

    from(assignments)
      .pipe(
        concatMap((a) =>
          this.substitutionService
            .create({
              idTeacherAssignment: a.id,
              idSubstitute,
              startDate,
              endDate: null,
              notes,
            })
            .pipe(
              map((res) => ({
                assignmentId: a.id,
                ok: res.success,
                conflict: false,
              })),
              catchError((err) =>
                of({
                  assignmentId: a.id,
                  ok: false,
                  conflict: err?.status === 409,
                }),
              ),
            ),
        ),
        toArray(),
      )
      .subscribe({
        next: (results) => {
          this.saving.set(false);
          const ok = results.filter((r) => r.ok).length;
          const conflicts = results.filter((r) => r.conflict).length;
          const failed = results.length - ok;

          if (ok === results.length) {
            this.substitutionCreated.emit();
            return;
          }

          if (ok > 0) {
            this.bulkSummary.set(
              this.translate.instant('lists.substitutions.bulkPartialSuccess', {
                ok,
                total: results.length,
              }),
            );
            this.substitutionService.loadSubstitutions();
            return;
          }

          if (conflicts === results.length) {
            this.errorMessage.set('lists.substitutions.createConflict');
            return;
          }

          this.errorMessage.set('lists.substitutions.createError');
        },
        error: () => {
          this.saving.set(false);
          this.errorMessage.set('lists.substitutions.createError');
        },
      });
  }

  private loadData(): void {
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      subs: this.substitutionService.getAll(),
      assignments: this.assignmentHttp.getAll(),
    }).subscribe({
      next: ({ subs, assignments }) => {
        this.loading.set(false);
        const activeSubs = subs.success ? subs.data.filter((s) => s.endDate == null) : [];
        this.activeSubstitutions.set(activeSubs);
        this.activeAssignmentIds.set(
          new Set(activeSubs.map((s) => s.idTeacherAssignment)),
        );

        if (!assignments.success) {
          this.loadError.set(true);
          this.allAssignments.set([]);
          return;
        }
        this.allAssignments.set(
          assignmentsForCurrentSchoolYear(
            assignments.data,
            environment.currentSchoolYear,
          ),
        );
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  private distinctTeachersFromAssignments(
    assignments: AssignmentWithIncludes[],
  ): TeacherOption[] {
    const byId = new Map<number, string>();
    const teacherNameById = new Map(this.allTeachers().map((t) => [t.id, t.label]));

    for (const a of assignments) {
      const id = a.teacher?.id ?? a.idTeacher;
      if (!id) {
        continue;
      }
      if (!byId.has(id)) {
        const fromAssignment = a.teacher?.name
          ? this.teacherLabel(a.teacher.name, a.teacher.surname)
          : null;
        byId.set(id, fromAssignment ?? teacherNameById.get(id) ?? `#${id}`);
      }
    }

    return [...byId.entries()]
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private substituteOptionLabel(
    teacherId: number,
    name: string,
    assignments: AssignmentWithIncludes[],
    activeSubstitutions: AssignmentSubstitution[],
    schoolYear: string,
  ): string {
    const load = teacherOwnLoadFromAssignments(assignments, teacherId, schoolYear);
    if (load.ownWeeklyHours === 0 && load.ownAssignmentCount === 0) {
      return `${name} (0 h)`;
    }
    return `${name} (${load.ownWeeklyHours} h, ${load.ownAssignmentCount} imp.)`;
  }

  private teacherLabel(name: string, surname?: string): string {
    return `${name} ${surname ?? ''}`.trim();
  }

  private todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }
}
