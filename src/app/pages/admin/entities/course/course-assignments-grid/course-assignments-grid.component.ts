import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AssignmentWithIncludes } from '../../../../../core/models/assingment';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';
import { CourseAssignmentGridRow } from '../../../../../core/models/course-assignments/course-assignment-grid-row.model';
import { Group } from '../../../../../core/models/group';
import { Teacher } from '../../../../../core/models/teacher';
import { AssignmentsService } from '../../../../../core/services/admin/entities/assignments.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { TeachersService } from '../../../../../core/services/admin/entities/teachers.service';
import { environment } from '../../../../../../environments/environment';

/**
 * Datagrid fijo de asignaciones por asignatura (CURSO-98).
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

  readonly context = input.required<CourseAssignmentsContext>();
  readonly back = output<void>();

  readonly schoolYear = signal(environment.currentSchoolYear);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly existingAssignments = signal<AssignmentWithIncludes[]>([]);
  readonly rows = signal<CourseAssignmentGridRow[]>([]);
  readonly teachers = signal<Teacher[]>([]);
  readonly groups = signal<Group[]>([]);

  ngOnInit(): void {
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
            })),
          );
        }
        this.existingAssignments.set(existing.success ? existing.data : []);
        this.teachers.set(teachers.success ? teachers.data : []);
        this.groups.set(groups.success ? groups.data : []);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
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
  }

  onGroupChange(row: CourseAssignmentGridRow, value: string): void {
    const id = value === '' ? null : Number(value);
    this.updateRow(row.idSubject, { idGroup: id });
  }

  private updateRow(
    idSubject: number,
    patch: Partial<Pick<CourseAssignmentGridRow, 'idTeacher' | 'idGroup'>>,
  ): void {
    this.rows.update((list) =>
      list.map((r) => (r.idSubject === idSubject ? { ...r, ...patch } : r)),
    );
  }

  onBack(): void {
    this.back.emit();
  }
}
