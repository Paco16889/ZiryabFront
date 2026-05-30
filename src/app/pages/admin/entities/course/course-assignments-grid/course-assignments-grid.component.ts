import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { AssignmentBulkCreateItem } from '../../../../../core/models/course-assignments/course-assignments-api.model';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';
import { CourseAssignmentGridRow } from '../../../../../core/models/course-assignments/course-assignment-grid-row.model';
import { Group } from '../../../../../core/models/group';
import { Teacher } from '../../../../../core/models/teacher';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { WeekScheduleNavigationService } from '../../../../../core/services/UI/week-schedule-navigation.service';
import { environment } from '../../../../../../environments/environment';
export type CourseAssignmentsSaveFeedback = {
  created: number;
  duplicates: number;
  incomplete: number;
  hasErrors: boolean;
};

/**
 * Datagrid fijo de asignaciones por asignatura (CURSO-98 / CURSO-100).
 */
@Component({
  selector: 'app-course-assignments-grid',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './course-assignments-grid.component.html',
  styleUrl: './course-assignments-grid.component.scss',
})
export class CourseAssignmentsGridComponent implements OnInit {
  private readonly assignmentsService = inject(AssignmentsService);
  private readonly teachersService = inject(TeachersService);
  private readonly groupService = inject(GroupService);
  private readonly scheduleNav = inject(WeekScheduleNavigationService);
  private readonly http = inject(HttpClient);
  private readonly assignmentsApiUrl = `${environment.apiUrl}/assignments`;

  readonly context = input.required<CourseAssignmentsContext>();
  readonly back = output<void>();

  readonly schoolYear = signal(environment.currentSchoolYear);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly saving = signal(false);
  readonly saveFeedback = signal<CourseAssignmentsSaveFeedback | null>(null);
  readonly saveValidation = signal<'noneToSave' | null>(null);
  readonly existingAssignments = signal<AssignmentWithIncludes[]>([]);
  readonly updatingTutorAssignments = signal(false);
  readonly tutorUpdateError = signal<string | null>(null);
  readonly tutorUpdateSuccess = signal(false);
  private readonly initialTutorAssignmentByGroup = signal<Record<number, number | null>>({});
  readonly assignedGroupIds = computed(() => {
    const ids = new Set<number>();
    for (const a of this.existingAssignments()) {
      if (a.group?.id != null) {
        ids.add(a.group.id);
      }
    }
    return ids;
  });
  readonly existingAssignmentsForView = computed(() =>
    [...this.existingAssignments()].sort((a, b) => {
      const groupCmp = (a.group?.name ?? '').localeCompare(b.group?.name ?? '');
      if (groupCmp !== 0) return groupCmp;
      const subjectCmp = (a.subject?.name ?? '').localeCompare(b.subject?.name ?? '');
      if (subjectCmp !== 0) return subjectCmp;
      return this.assignmentTeacherLabel(a).localeCompare(this.assignmentTeacherLabel(b));
    }),
  );
  readonly currentTutorAssignmentByGroup = computed(() => {
    const byGroup: Record<number, number | null> = {};
    for (const a of this.existingAssignments()) {
      const groupId = this.getAssignmentGroupId(a);
      if (groupId == null) continue;
      if (!(groupId in byGroup)) {
        byGroup[groupId] = null;
      }
      if (a.isTutor) {
        byGroup[groupId] = a.id;
      }
    }
    return byGroup;
  });
  readonly hasPendingTutorUpdates = computed(() => {
    const current = this.currentTutorAssignmentByGroup();
    const initial = this.initialTutorAssignmentByGroup();
    const groups = new Set<number>([
      ...Object.keys(current).map(Number),
      ...Object.keys(initial).map(Number),
    ]);
    for (const groupId of groups) {
      if ((current[groupId] ?? null) !== (initial[groupId] ?? null)) {
        return true;
      }
    }
    return false;
  });
  readonly rows = signal<CourseAssignmentGridRow[]>([]);
  readonly teachers = signal<Teacher[]>([]);
  readonly groups = signal<Group[]>([]);
  readonly showSchedulePrompt = signal(false);
  private readonly lastSavedGroupId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadGrid();
  }

  gradeDisplay(): string {
    const grade = this.context().grade.trim();
    if (/^\d+$/.test(grade)) {
      return `${grade}º`;
    }
    return grade;
  }

  teacherLabel(teacher: Teacher): string {
    return [teacher.name, teacher.surname, teacher.ndSurname].filter(Boolean).join(' ').trim();
  }

  assignmentTeacherLabel(a: AssignmentWithIncludes): string {
    const t = a.teacher;
    if (!t?.name) {
      return '—';
    }
    return [t.name, t.surname].filter(Boolean).join(' ').trim();
  }

  onTeacherChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    this.updateRow(row.idSubject, { idTeacher: id });
    if (id == null) {
      this.updateRow(row.idSubject, { isTutor: false });
    }
    this.clearSaveMessages();
  }

  onGroupChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    const isFirstRow = this.rows()[0]?.idSubject === row.idSubject;
    if (isFirstRow && id != null) {
      this.rows.update((list) => list.map((r) => ({ ...r, idGroup: id })));
      this.enforceSingleTutorByGroup();
    } else {
      this.updateRow(row.idSubject, { idGroup: id });
      if (id == null) {
        this.updateRow(row.idSubject, { isTutor: false });
      }
      this.enforceSingleTutorByGroup();
    }
    this.clearSaveMessages();
  }

  onTutorChange(row: CourseAssignmentGridRow, checked: boolean): void {
    this.tutorUpdateError.set(null);
    this.tutorUpdateSuccess.set(false);
    if (!checked) {
      this.updateRow(row.idSubject, { isTutor: false });
      return;
    }
    if (row.idGroup == null || row.idTeacher == null) {
      return;
    }
    this.rows.update((list) =>
      list.map((r) => {
        if (r.idGroup !== row.idGroup) {
          return r;
        }
        return { ...r, isTutor: r.idSubject === row.idSubject };
      }),
    );
    this.clearSaveMessages();
  }

  onExistingTutorToggle(assignmentId: number, checked: boolean): void {
    this.tutorUpdateError.set(null);
    this.tutorUpdateSuccess.set(false);
    const target = this.existingAssignments().find((a) => a.id === assignmentId);
    if (!target) {
      return;
    }
    const groupId = this.getAssignmentGroupId(target);
    if (groupId == null) {
      return;
    }
    this.existingAssignments.update((list) =>
      list.map((a) => {
        const gid = this.getAssignmentGroupId(a);
        if (gid !== groupId) {
          return a;
        }
        if (!checked) {
          return a.id === assignmentId ? { ...a, isTutor: false } : a;
        }
        return { ...a, isTutor: a.id === assignmentId };
      }),
    );
  }

  updateTutorAssignments(): void {
    if (!this.hasPendingTutorUpdates()) {
      return;
    }
    this.updatingTutorAssignments.set(true);
    this.tutorUpdateError.set(null);
    this.tutorUpdateSuccess.set(false);

    const current = this.currentTutorAssignmentByGroup();
    const initial = this.initialTutorAssignmentByGroup();
    const changedGroupIds = Object.keys(current)
      .map(Number)
      .filter((groupId) => (current[groupId] ?? null) !== (initial[groupId] ?? null));

    const updates = changedGroupIds.flatMap((groupId) => {
      const selectedTutorAssignmentId = current[groupId] ?? null;
      return this.existingAssignments()
        .filter((a) => this.getAssignmentGroupId(a) === groupId)
        .map((a) => ({
          id: a.id,
          isTutor: selectedTutorAssignmentId != null && a.id === selectedTutorAssignmentId,
        }));
    });

    if (updates.length === 0) {
      this.updatingTutorAssignments.set(false);
      return;
    }

    // Evita carrera: primero desactivar tutores actuales, luego activar el nuevo.
    updates.sort((x, y) => Number(x.isTutor) - Number(y.isTutor));

    from(updates)
      .pipe(
        concatMap((u) =>
          this.http.patch(`${this.assignmentsApiUrl}/${u.id}`, { isTutor: u.isTutor }),
        ),
      )
      .subscribe({
      next: () => {
        this.updatingTutorAssignments.set(false);
        this.tutorUpdateSuccess.set(true);
        this.initialTutorAssignmentByGroup.set({ ...this.currentTutorAssignmentByGroup() });
        this.refreshExistingAssignments();
      },
      error: (err) => {
        this.updatingTutorAssignments.set(false);
        this.tutorUpdateError.set(err?.error?.message ?? 'courseAssignments.grid.tutorUpdateError');
      },
    });
  }

  availableGroupsForRow(row: CourseAssignmentGridRow): Group[] {
    const assigned = this.assignedGroupIds();
    return this.groups().filter((g) => g.id === row.idGroup || !assigned.has(g.id));
  }

  onSave(): void {
    this.clearSaveMessages();

    const completeRows = this.rows().filter((r) => this.isRowComplete(r));
    const incompleteCount = this.rows().filter((r) => this.isRowIncomplete(r)).length;

    if (completeRows.length === 0) {
      this.saveValidation.set('noneToSave');
      if (incompleteCount > 0) {
        this.saveFeedback.set({
          created: 0,
          duplicates: 0,
          incomplete: incompleteCount,
          hasErrors: false,
        });
      }
      return;
    }

    const payload: AssignmentBulkCreateItem[] = completeRows.map((r) => ({
      idTeacher: r.idTeacher!,
      idSubject: r.idSubject,
      idGroup: r.idGroup!,
      schoolYear: this.schoolYear(),
      isTutor: r.isTutor,
    }));

    const savedSubjectIds = new Set(completeRows.map((r) => r.idSubject));

    this.saving.set(true);
    this.assignmentsService.createAssignmentsBulk(payload).subscribe({
      next: (res) => {
        this.saving.set(false);
        const data = res.data ?? { created: 0, duplicates: 0, skipped: 0, errors: [] };
        this.saveFeedback.set({
          created: data.created,
          duplicates: data.duplicates,
          incomplete: incompleteCount,
          hasErrors: data.errors.length > 0 || !res.success,
        });

        if (data.created > 0) {
          this.lastSavedGroupId.set(completeRows[0]?.idGroup ?? null);
          this.showSchedulePrompt.set(true);
          this.clearRows(savedSubjectIds);
          this.refreshExistingAssignments();
        } else if (data.duplicates > 0) {
          this.refreshExistingAssignments();
        }
      },
      error: () => {
        this.saving.set(false);
        this.saveFeedback.set({
          created: 0,
          duplicates: 0,
          incomplete: incompleteCount,
          hasErrors: true,
        });
      },
    });
  }

  feedbackIsSuccess(): boolean {
    const f = this.saveFeedback();
    return !!f && f.created > 0 && !f.hasErrors;
  }

  feedbackIsWarning(): boolean {
    const f = this.saveFeedback();
    return !!f && (f.duplicates > 0 || f.incomplete > 0) && !f.hasErrors;
  }

  private loadGrid(): void {
    const ctx = this.context();
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      subjects: this.assignmentsService.getSubjectsByCourseAndGrade(ctx.idCourse, ctx.grade),
      existing: this.assignmentsService.getAssignmentsByCourseAndGrade(
        ctx.idCourse,
        ctx.grade,
        this.schoolYear(),
      ),
      teachers: this.teachersService.getAllTeachers(),
      groups: this.groupService.getAllGroups(),
    }).subscribe({
      next: ({ subjects, existing, teachers, groups }) => {
        this.loading.set(false);
        if (!subjects.success) {
          this.loadError.set(true);
          this.rows.set([]);
        } else {
          this.rows.set(
            subjects.data.map((s) => ({
              idSubject: s.id,
              subjectName: s.name,
              idTeacher: null,
              idGroup: null,
              isTutor: false,
            })),
          );
        }
        this.existingAssignments.set(existing.success ? existing.data : []);
        this.initialTutorAssignmentByGroup.set(this.buildTutorAssignmentByGroup(existing.success ? existing.data : []));
        this.tutorUpdateSuccess.set(false);
        this.tutorUpdateError.set(null);
        this.teachers.set(teachers.success ? teachers.data : []);
        this.groups.set(groups.success ? groups.data : []);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  private refreshExistingAssignments(): void {
    const ctx = this.context();
    this.assignmentsService
      .getAssignmentsByCourseAndGrade(ctx.idCourse, ctx.grade, this.schoolYear())
      .subscribe((res) => {
        if (res.success) {
          this.existingAssignments.set(res.data);
          this.initialTutorAssignmentByGroup.set(this.buildTutorAssignmentByGroup(res.data));
        }
      });
  }

  private isRowComplete(row: CourseAssignmentGridRow): boolean {
    return row.idTeacher != null && row.idGroup != null;
  }

  private isRowIncomplete(row: CourseAssignmentGridRow): boolean {
    const hasTeacher = row.idTeacher != null;
    const hasGroup = row.idGroup != null;
    return hasTeacher !== hasGroup;
  }

  private clearRows(subjectIds: Set<number>): void {
    this.rows.update((list) =>
      list.map((r) =>
        subjectIds.has(r.idSubject)
          ? { ...r, idTeacher: null, idGroup: null, isTutor: false }
          : r,
      ),
    );
  }

  private clearSaveMessages(): void {
    this.saveFeedback.set(null);
    this.saveValidation.set(null);
    this.showSchedulePrompt.set(false);
    this.tutorUpdateSuccess.set(false);
    this.tutorUpdateError.set(null);
  }

  private updateRow(
    idSubject: number,
    patch: Partial<Pick<CourseAssignmentGridRow, 'idTeacher' | 'idGroup' | 'isTutor'>>,
  ): void {
    this.rows.update((list) =>
      list.map((r) => (r.idSubject === idSubject ? { ...r, ...patch } : r)),
    );
  }

  private enforceSingleTutorByGroup(): void {
    this.rows.update((list) => {
      const firstTutorByGroup = new Map<number, number>();
      return list.map((row) => {
        if (!row.isTutor || row.idGroup == null || row.idTeacher == null) {
          return row;
        }
        const existing = firstTutorByGroup.get(row.idGroup);
        if (existing == null) {
          firstTutorByGroup.set(row.idGroup, row.idSubject);
          return row;
        }
        if (existing !== row.idSubject) {
          return { ...row, isTutor: false };
        }
        return row;
      });
    });
  }

  private buildTutorAssignmentByGroup(
    list: AssignmentWithIncludes[],
  ): Record<number, number | null> {
    const byGroup: Record<number, number | null> = {};
    for (const a of list) {
      const groupId = this.getAssignmentGroupId(a);
      if (groupId == null) continue;
      if (!(groupId in byGroup)) {
        byGroup[groupId] = null;
      }
      if (a.isTutor) {
        byGroup[groupId] = a.id;
      }
    }
    return byGroup;
  }

  private getAssignmentGroupId(a: AssignmentWithIncludes): number | null {
    if (a.group?.id != null) {
      return a.group.id;
    }
    return (a as { idGroup?: number }).idGroup ?? null;
  }

  onBack(): void {
    this.back.emit();
  }

  dismissSchedulePrompt(): void {
    this.showSchedulePrompt.set(false);
  }

  goToCreateSchedule(): void {
    const idGroup = this.lastSavedGroupId();
    if (idGroup == null) {
      return;
    }
    const ctx = this.context();
    this.scheduleNav.goToCreateTemplate({
      idCourse: ctx.idCourse,
      grade: ctx.grade,
      idGroup,
    });
    this.showSchedulePrompt.set(false);
    this.back.emit();
  }
}
