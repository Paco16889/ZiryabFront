import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { CourseGroupService } from '../../../../../core/services/admin/entities/course-group.service';
import { CourseGroup } from '../../../../../core/models/course-group';
import { environment } from '../../../../../../environments/environment';

/** Profesor candidato a tutor en un desplegable. */
interface TeacherOption {
  /** Identificador del profesor. */
  id: number;

  /** Nombre del profesor. */
  name: string;

  /** Primer apellido. */
  surname: string;
}

/** Ciclo formativo en el formulario de nueva clase. */
interface CourseOption {
  /** Identificador del ciclo. */
  id: number;

  /** Nombre del ciclo. */
  name: string;
}

/** Grupo académico en el formulario de nueva clase. */
interface GroupOption {
  /** Identificador del grupo. */
  id: number;

  /** Nombre del grupo. */
  name: string;
}

/** Fila editable de asignación de tutor a una clase (ciclo + grupo + grade). */
interface CourseGroupRow {
  /** Relación ciclo–grupo persistida. */
  cg: CourseGroup;

  /** Tutor seleccionado en el desplegable (puede ser `null`). */
  selectedTutorId: number | null;

  /** Guardado en curso para esta fila. */
  saving: boolean;

  /** Muestra confirmación visual tras guardar. */
  saved: boolean;

  /** Mensaje de error de la última operación. */
  error: string | null;

  /** Profesores que pueden ser tutor de esta clase. */
  eligibleTutors: TeacherOption[];

  /** Carga de tutores elegibles en curso. */
  loadingTutors: boolean;
}

/**
 * Pantalla admin para asignar tutores a clases (ciclo + grupo + grade)
 * y crear nuevas vinculaciones ciclo–grupo.
 */
@Component({
  selector: 'app-tutor-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './tutor-assignment.component.html',
})
export class TutorAssignmentComponent implements OnInit {
  /** CRUD de clases (ciclo–grupo–grade) y asignación de tutor. */
  private readonly cgService = inject(CourseGroupService);

  /** Carga catálogos de ciclos, grupos y tutores elegibles. */
  private readonly http = inject(HttpClient);

  /** Filas de clases con tutor editable. */
  rows = signal<CourseGroupRow[]>([]);

  /** Ciclos para el formulario de alta de clase. */
  courses = signal<CourseOption[]>([]);

  /** Grupos para el formulario de alta de clase. */
  groups = signal<GroupOption[]>([]);

  /** Carga inicial de tablas. */
  loading = signal(true);

  /** Clave i18n o mensaje si falla la carga. */
  loadError = signal<string | null>(null);

  /** Ciclo elegido al crear una clase nueva. */
  newCourseId = signal<number | null>(null);

  /** Grupo elegido al crear una clase nueva. */
  newGroupId = signal<number | null>(null);

  /** Grade elegido al crear una clase nueva. */
  newGrade = signal<string | null>(null);

  /** Alta de clase en curso. */
  creating = signal(false);

  /** Error al crear clase. */
  createError = signal<string | null>(null);

  /** Carga cursos, grupos y filas de `course_groups`. */
  ngOnInit(): void {
    this.loadAll();
  }

  /** Peticiones paralelas de catálogos y listado de clases. */
  private loadAll(): void {
    this.loading.set(true);
    this.loadError.set(null);

    const coursesUrl = `${environment.apiUrl}/courses`;
    const groupsUrl = `${environment.apiUrl}/groups`;

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

  /** Carga profesores elegibles como tutor para una fila. */
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

  /** Persiste el tutor seleccionado para la clase. */
  saveTutor(row: CourseGroupRow): void {
    row.saving = true;
    row.saved = false;
    row.error = null;

    this.cgService.assignTutor(row.cg.id, row.selectedTutorId).subscribe({
      next: (res) => {
        row.cg = res.data;
        row.saving = false;
        row.saved = true;
        setTimeout(() => (row.saved = false), 3000);
      },
      error: (err) => {
        row.saving = false;
        row.error = err?.error?.message ?? 'adminPages.tutors.errorSaving';
      },
    });
  }

  /** Crea una nueva clase (ciclo + grupo + grade) y la añade a la tabla. */
  createCourseGroup(): void {
    const cId = this.newCourseId();
    const gId = this.newGroupId();
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

  /** Elimina la vinculación ciclo–grupo de la fila. */
  deleteRow(row: CourseGroupRow): void {
    this.cgService.delete(row.cg.id).subscribe({
      next: () => this.rows.update((rows) => rows.filter((r) => r.cg.id !== row.cg.id)),
    });
  }
}
