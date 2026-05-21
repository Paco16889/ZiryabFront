import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { CourseGroupService } from '../../../../../core/services/admin/entities/course-group.service';
import { CourseGroup } from '../../../../../core/models/course-group';
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

interface CourseGroupRow {
  cg: CourseGroup;
  selectedTutorId: number | null;
  saving: boolean;
  saved: boolean;
  error: string | null;
  eligibleTutors: TeacherOption[];
  loadingTutors: boolean;
}

@Component({
  selector: 'app-tutor-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './tutor-assignment.component.html',
})
export class TutorAssignmentComponent implements OnInit {
  private readonly cgService   = inject(CourseGroupService);
  private readonly http        = inject(HttpClient);

  rows       = signal<CourseGroupRow[]>([]);
  courses    = signal<CourseOption[]>([]);
  groups     = signal<GroupOption[]>([]);
  loading    = signal(true);
  loadError  = signal<string | null>(null);

  // Estado del formulario de creación de nueva clase
  newCourseId = signal<number | null>(null);
  newGroupId  = signal<number | null>(null);
  newGrade    = signal<string | null>(null);
  creating    = signal(false);
  createError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);

    const coursesUrl = `${environment.apiUrl}/courses`;
    const groupsUrl  = `${environment.apiUrl}/groups`;

    this.http.get<{ success: boolean; data: CourseOption[] }>(coursesUrl).subscribe({
      next: (res) => this.courses.set(res.data.sort((a, b) => a.name.localeCompare(b.name))),
    });

    this.http.get<{ success: boolean; data: GroupOption[] }>(groupsUrl).subscribe({
      next: (res) => this.groups.set(res.data.sort((a, b) => a.name.localeCompare(b.name))),
    });

    this.cgService.getAll().subscribe({
      next: (res) => {
        if (res.success) {
          const initial = res.data.map((cg): CourseGroupRow => ({
            cg,
            selectedTutorId: cg.tutorId,
            saving: false,
            saved: false,
            error: null,
            eligibleTutors: [],
            loadingTutors: true,
          }));
          this.rows.set(initial);
          // Carga los tutores elegibles de cada fila en paralelo
          initial.forEach((row) => this.loadEligibleTutors(row));
        }
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('adminPages.tutors.errorLoading');
        this.loading.set(false);
      },
    });
  }

  private loadEligibleTutors(row: CourseGroupRow): void {
    const url = `${environment.apiUrl}/course-groups/${row.cg.id}/eligible-tutors`;
    this.http.get<{ success: boolean; data: TeacherOption[] }>(url).subscribe({
      next: (res) => {
        this.rows.update((rows) =>
          rows.map((r) =>
            r.cg.id === row.cg.id
              ? { ...r, eligibleTutors: res.data, loadingTutors: false }
              : r,
          ),
        );
      },
      error: () => {
        this.rows.update((rows) =>
          rows.map((r) =>
            r.cg.id === row.cg.id ? { ...r, loadingTutors: false } : r,
          ),
        );
      },
    });
  }

  saveTutor(row: CourseGroupRow): void {
    row.saving = true;
    row.saved  = false;
    row.error  = null;

    this.cgService.assignTutor(row.cg.id, row.selectedTutorId).subscribe({
      next: (res) => {
        row.cg           = res.data;
        row.saving       = false;
        row.saved        = true;
        setTimeout(() => (row.saved = false), 3000);
      },
      error: (err) => {
        row.saving = false;
        row.error  = err?.error?.message ?? 'adminPages.tutors.errorSaving';
      },
    });
  }

  createCourseGroup(): void {
    const cId   = this.newCourseId();
    const gId   = this.newGroupId();
    const grade = this.newGrade();
    if (!cId || !gId || !grade) return;

    this.creating.set(true);
    this.createError.set(null);

    this.cgService.create(cId, gId, grade).subscribe({
      next: (res) => {
        const newRow: CourseGroupRow = {
          cg: res.data,
          selectedTutorId: null,
          saving: false,
          saved: false,
          error: null,
          eligibleTutors: [],
          loadingTutors: true,
        };
        this.rows.update((rows) => [...rows, newRow]);
        this.loadEligibleTutors(newRow);
        this.newCourseId.set(null);
        this.newGroupId.set(null);
        this.newGrade.set(null);
        this.creating.set(false);
      },
      error: (err) => {
        this.createError.set(err?.error?.message ?? 'adminPages.tutors.errorCreating');
        this.creating.set(false);
      },
    });
  }

  deleteRow(row: CourseGroupRow): void {
    this.cgService.delete(row.cg.id).subscribe({
      next: () => this.rows.update((rows) => rows.filter((r) => r.cg.id !== row.cg.id)),
    });
  }
}
