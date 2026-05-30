import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { from, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AssignmentWithIncludes, AssignmentsWithIncludesResponse } from '../../../../../core/models/assingment';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from '../../../generic-list-item/generic-list-item.component';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { Teacher } from '../../../../../core/models/teacher';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';
import { environment } from '../../../../../../environments/environment';

interface TeacherOption {
  id: number;
  name: string;
  surname: string;
}

interface CourseOption {
  id: number;
  name: string;
}

interface GroupOption {
  id: number;
  name: string;
}

interface TutorClassRow {
  key: string;
  idCourse: number;
  courseName: string;
  idGroup: number;
  groupName: string;
  grade: string;
  schoolYear: string;
  assignments: AssignmentWithIncludes[];
  selectedTutorId: number | null;
  saving: boolean;
  saved: boolean;
  error: string | null;
  eligibleTutors: TeacherOption[];
}

interface TutorSummaryItem {
  id: number;
  teacherName: string;
  className: string;
  schoolYear: string;
}

@Component({
  selector: 'app-tutor-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, GenericListItemComponent],
  templateUrl: './tutor-assignment.component.html',
})
export class TutorAssignmentComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);
  private readonly teachersService = inject(TeachersService);
  private readonly assignmentsUrl = `${environment.apiUrl}/assignments`;

  allAssignments = signal<AssignmentWithIncludes[]>([]);
  allRows = signal<TutorClassRow[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);
  showEditor = signal(false);

  selectedCourseId = signal<number | null>(null);
  selectedGroupId = signal<number | null>(null);
  selectedGrade = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAll();
  }

  readonly courses = computed<CourseOption[]>(() => {
    const map = new Map<number, string>();
    for (const row of this.allRows()) {
      if (!map.has(row.idCourse)) {
        map.set(row.idCourse, row.courseName);
      }
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly groups = computed<GroupOption[]>(() => {
    const selectedCourseId = this.selectedCourseId();
    const source = selectedCourseId == null
      ? this.allRows()
      : this.allRows().filter((r) => r.idCourse === selectedCourseId);
    const map = new Map<number, string>();
    for (const row of source) {
      if (!map.has(row.idGroup)) {
        map.set(row.idGroup, row.groupName);
      }
    }
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly grades = computed<string[]>(() => {
    const selectedCourseId = this.selectedCourseId();
    const source = selectedCourseId == null
      ? this.allRows()
      : this.allRows().filter((r) => r.idCourse === selectedCourseId);
    return [...new Set(source.map((r) => r.grade))]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  });

  readonly rows = computed<TutorClassRow[]>(() => {
    const selectedCourseId = this.selectedCourseId();
    const selectedGroupId = this.selectedGroupId();
    const selectedGrade = this.selectedGrade();

    return this.allRows().filter((r) => {
      if (selectedCourseId != null && r.idCourse !== selectedCourseId) return false;
      if (selectedGroupId != null && r.idGroup !== selectedGroupId) return false;
      if (selectedGrade != null && r.grade !== selectedGrade) return false;
      return true;
    });
  });

  readonly tutorSummaryItems = computed<TutorSummaryItem[]>(() => {
    let nextId = 1;
    return this.allAssignments()
      .filter((a) => !!a.isTutor)
      .map((a) => {
        const teacherName = a.teacher?.name
          ? `${a.teacher.name} ${a.teacher.surname ?? ''}`.trim()
          : this.translate.instant('adminPages.tutors.noTutor');
        const grade = a.subject?.grade ?? '';
        const gradeLabel = /^\d+$/.test(grade) ? `${grade}º` : grade || '—';
        const courseName = a.subject?.course?.name ?? '—';
        const groupName = a.group?.name ?? '—';
        return {
          id: a.teacher?.id ?? nextId++,
          teacherName,
          className: `${gradeLabel} · ${courseName} · ${groupName}`,
          schoolYear: a.schoolYear ?? '—',
        };
      })
      .sort((x, y) => x.teacherName.localeCompare(y.teacherName));
  });

  get tutorSummaryConfig(): ListItemConfig<TutorSummaryItem, never, never, never> {
    return {
      fields: [
        {
          key: 'teacherName',
          label: this.translate.instant('adminPages.tutors.listTeacher'),
          className: 'font-semibold text-purple-700',
          order: 1,
        },
        {
          key: 'className',
          label: this.translate.instant('adminPages.tutors.listClass'),
          className: 'text-gray-700',
          order: 2,
        },
        {
          key: 'schoolYear',
          label: this.translate.instant('adminPages.tutors.listYear'),
          className: 'text-sm text-gray-600',
          order: 3,
        },
      ],
      actions: { edit: false, delete: false, detail: true },
      layout: { responsive: false },
      entityType: this.translate.instant('adminPages.tutors.title'),
      entityNameFormat: (item) => item.teacherName,
      getByIdFn: (id: number) => this.teachersService.getTeacherById(id),
    };
  }

  get tutorSummaryDetailConfig(): ViewDetailConfig<Teacher> {
    return {
      fields: [
        { key: 'name', type: 'text', label: 'Nombre' },
        { key: 'surname', type: 'text', label: 'Apellido' },
        { key: 'email', type: 'text', label: 'Email' },
        { key: 'dni', type: 'text', label: 'DNI' },
        { key: 'birthDate', type: 'text', label: 'Nacimiento' },
      ],
    };
  }

  private loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.http
      .get<AssignmentsWithIncludesResponse>(this.assignmentsUrl)
      .pipe(catchError(() => of({ success: false, data: [], count: 0 })))
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (!res.success) {
            this.loadError.set('adminPages.tutors.errorLoading');
            this.allAssignments.set([]);
            this.allRows.set([]);
            return;
          }
          this.allAssignments.set(res.data);
          const rows = this.buildRowsFromAssignments(res.data);
          this.allRows.set(rows);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set('adminPages.tutors.errorLoading');
        },
      });
  }

  private buildRowsFromAssignments(items: AssignmentWithIncludes[]): TutorClassRow[] {
    const currentYear = environment.currentSchoolYear;
    const currentYearAssignments = items.filter((a) => a.schoolYear === currentYear);
    const source = currentYearAssignments.length > 0 ? currentYearAssignments : items;

    const grouped = new Map<string, AssignmentWithIncludes[]>();
    for (const assignment of source) {
      const courseId = assignment.subject?.course?.id;
      const courseName = assignment.subject?.course?.name;
      const groupId = assignment.group?.id;
      const groupName = assignment.group?.name;
      const grade = assignment.subject?.grade;
      const schoolYear = assignment.schoolYear;

      if (!courseId || !courseName || !groupId || !groupName || !grade || !schoolYear) {
        continue;
      }

      const key = `${courseId}|${grade}|${groupId}|${schoolYear}`;
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(assignment);
    }

    const rows: TutorClassRow[] = [];
    for (const [key, assignments] of grouped.entries()) {
      const sample = assignments[0];
      const eligibleTutors = this.getEligibleTutors(assignments);
      const currentTutor = assignments.find((a) => (a as AssignmentWithIncludes & { isTutor?: boolean }).isTutor);

      rows.push({
        key,
        idCourse: sample.subject!.course!.id,
        courseName: sample.subject!.course!.name,
        idGroup: sample.group!.id,
        groupName: sample.group!.name,
        grade: sample.subject!.grade ?? '',
        schoolYear: sample.schoolYear,
        assignments,
        selectedTutorId: currentTutor?.idTeacher ?? null,
        saving: false,
        saved: false,
        error: null,
        eligibleTutors,
      });
    }

    return rows.sort((a, b) => {
      if (a.courseName !== b.courseName) return a.courseName.localeCompare(b.courseName);
      const g = a.grade.localeCompare(b.grade, undefined, { numeric: true });
      if (g !== 0) return g;
      return a.groupName.localeCompare(b.groupName);
    });
  }

  private getEligibleTutors(assignments: AssignmentWithIncludes[]): TeacherOption[] {
    const byId = new Map<number, TeacherOption>();
    for (const assignment of assignments) {
      const t = assignment.teacher;
      if (!t?.id || !t.name) continue;
      if (!byId.has(t.id)) {
        byId.set(t.id, {
          id: t.id,
          name: t.name,
          surname: t.surname ?? '',
        });
      }
    }
    return [...byId.values()].sort((a, b) =>
      `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`),
    );
  }

  currentTutorLabel(row: TutorClassRow): string | null {
    const found = row.eligibleTutors.find((t) => t.id === row.selectedTutorId);
    return found ? `${found.name} ${found.surname}`.trim() : null;
  }

  saveTutor(row: TutorClassRow): void {
    row.saving = true;
    row.saved = false;
    row.error = null;

    const updates = row.assignments
      .map((a) => ({
        id: a.id,
        isTutor: row.selectedTutorId != null && a.idTeacher === row.selectedTutorId,
      }))
      // Importante: primero quitamos tutorías y al final activamos la nueva.
      .sort((x, y) => Number(x.isTutor) - Number(y.isTutor));

    from(updates)
      .pipe(
        concatMap((u) =>
          this.http.patch(`${this.assignmentsUrl}/${u.id}`, { isTutor: u.isTutor }),
        ),
      )
      .subscribe({
      next: () => {
        row.saving = false;
        row.saved = true;
        setTimeout(() => (row.saved = false), 3000);
        this.loadAll();
      },
      error: (err) => {
        row.saving = false;
        row.error = err?.error?.message ?? 'adminPages.tutors.errorSaving';
      },
    });
  }

  clearFilters(): void {
    this.selectedCourseId.set(null);
    this.selectedGroupId.set(null);
    this.selectedGrade.set(null);
  }

  openEditor(): void {
    this.showEditor.set(true);
  }

  closeEditor(): void {
    this.showEditor.set(false);
  }
}
