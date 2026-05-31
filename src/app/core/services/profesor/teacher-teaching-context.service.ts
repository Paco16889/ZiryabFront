import { inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import {
  AssignmentSubstitution,
  SubstitutionTeacherAssignment,
} from '../../models/assignment-substitution';
import { TutoredCourseGroup } from '../../models/grade';
import { Enrollment } from '../../models/enrollment';
import { TeacherAssignmentContextRow } from '../../models/teacher/teacher-assignment-context';
import { WeekSchedule, WeekSchedulesAllResponse } from '../../models/week-schedule';
import { AssignmentSubstitutionsService } from '../admin/entities/assignment-substitutions.service';
import { WeekScheduleService } from '../admin/entities/services-for-week-schedule/week-schedule.service';
import { EnrollmentHttpService } from '../admin/entities/services-for-week-schedule/enrollment-http.service';
import { GradeService } from './grade.service';
import { ClasesService } from '../clases.service';

/**
 * Contexto único del profesor logueado: asignaciones propias + sustituciones activas
 * y resolución del id de profesor que debe usarse en cada llamada al API.
 */
@Injectable({
  providedIn: 'root',
})
export class TeacherTeachingContextService {
  private readonly clasesService = inject(ClasesService);
  private readonly substitutionsService = inject(AssignmentSubstitutionsService);
  private readonly weekScheduleService = inject(WeekScheduleService);
  private readonly enrollments = inject(EnrollmentHttpService);
  private readonly gradeService = inject(GradeService);

  private readonly rows = signal<TeacherAssignmentContextRow[]>([]);
  private readonly substitutingAssignmentIds = signal<Set<number>>(new Set());
  private loadedForTeacherId: number | null = null;

  /** Carga contexto una vez por sesión de usuario. */
  ensureLoaded(teacherId: number): Observable<TeacherAssignmentContextRow[]> {
    if (this.loadedForTeacherId === teacherId) {
      return of(this.rows());
    }
    return this.loadContext(teacherId);
  }

  getAssignmentRows(): TeacherAssignmentContextRow[] {
    return this.rows();
  }

  isSubstitutingAssignment(assignmentId: number): boolean {
    return this.substitutingAssignmentIds().has(assignmentId);
  }

  findAssignmentRow(assignmentId: number): TeacherAssignmentContextRow | undefined {
    return this.rows().find((r) => r.id === assignmentId);
  }

  /**
   * Id de profesor para rutas que reciben idTeacher en path/body.
   * En sustitución activa → sustituto (teacherId logueado); si no → titular indicado o el logueado.
   */
  resolveTeacherIdForApi(
    loggedInTeacherId: number,
    options?: { assignmentId?: number; titularTeacherId?: number },
  ): number {
    if (
      options?.assignmentId != null &&
      this.isSubstitutingAssignment(options.assignmentId)
    ) {
      return loggedInTeacherId;
    }
    if (options?.titularTeacherId != null) {
      const titularId = options.titularTeacherId;
      const coversTitular = this.rows().some(
        (r) => r.isSubstituting && r.titularTeacherId === titularId,
      );
      if (coversTitular) {
        return loggedInTeacherId;
      }
      return titularId;
    }
    return loggedInTeacherId;
  }

  getMyAssignmentRows(teacherId: number): Observable<TeacherAssignmentContextRow[]> {
    return this.ensureLoaded(teacherId);
  }

  /**
   * Horario del sustituto: el suyo como titular + las franjas del titular en asignaciones que cubre
   * (misma lógica que vería el titular, filtradas por esas asignaciones).
   */
  getMyWeekSchedules(loggedInTeacherId: number): Observable<WeekSchedule[]> {
    return this.ensureLoaded(loggedInTeacherId).pipe(
      switchMap((rows) => {
        const substitutingIds = new Set(
          rows.filter((r) => r.isSubstituting).map((r) => r.id),
        );
        const titularIds = [
          ...new Set(
            rows
              .filter((r) => r.isSubstituting && r.titularTeacherId != null)
              .map((r) => r.titularTeacherId!),
          ),
        ];

        const own$ = this.weekScheduleService.getSchedulesByTeacher(loggedInTeacherId);
        const titularCalls$ =
          titularIds.length > 0
            ? forkJoin(
                titularIds.map((tid) =>
                  this.weekScheduleService.getSchedulesByTeacher(tid),
                ),
              )
            : of([] as WeekSchedulesAllResponse[]);

        return forkJoin({ own: own$, titular: titularCalls$ }).pipe(
          map(({ own, titular }) => {
            const merged: WeekSchedule[] = own.success ? [...own.data] : [];
            for (const res of titular) {
              if (!res.success) {
                continue;
              }
              for (const ws of res.data) {
                const aid = ws.teacherAssignment?.id;
                if (aid != null && substitutingIds.has(aid)) {
                  merged.push(ws);
                }
              }
            }
            return this.dedupeSchedules(merged);
          }),
        );
      }),
    );
  }

  /**
   * Grupo tutorizado del profesor (como mucho uno: propio o por sustitución al titular tutor).
   * Regla de negocio: tutor de un solo grupo o de ninguno.
   */
  getMyTutoredGroups(loggedInTeacherId: number): Observable<TutoredCourseGroup[]> {
    return this.ensureLoaded(loggedInTeacherId).pipe(
      switchMap((rows) => {
        const tutorSubRows = rows.filter((r) => r.isSubstituting && r.isTutor);
        return this.gradeService.getTutoredGroups().pipe(
          switchMap((res) => {
            const own = res.data ?? [];
            if (tutorSubRows.length === 0) {
              return of(this.atMostOneTutoredGroup(own));
            }
            const loads = tutorSubRows.map((row) =>
              this.buildTutoredGroupFromAssignment(row).pipe(
                catchError(() => of(null)),
              ),
            );
            return forkJoin(loads).pipe(
              map((built) => {
                const byGroupId = new Map<number, TutoredCourseGroup>();
                for (const g of own) {
                  byGroupId.set(g.group.id, g);
                }
                for (const g of built) {
                  if (g && !byGroupId.has(g.group.id)) {
                    byGroupId.set(g.group.id, g);
                  }
                }
                return this.atMostOneTutoredGroup([...byGroupId.values()]);
              }),
            );
          }),
          catchError(() =>
            tutorSubRows.length === 0
              ? of([])
              : forkJoin(
                  tutorSubRows.map((row) =>
                    this.buildTutoredGroupFromAssignment(row).pipe(
                      catchError(() => of(null)),
                    ),
                  ),
                ).pipe(
                  map((built) =>
                    this.atMostOneTutoredGroup(
                      built.filter((g): g is TutoredCourseGroup => g != null),
                    ),
                  ),
                ),
          ),
        );
      }),
    );
  }

  /** En el dominio solo existe 0 o 1 grupo tutorizado por profesor. */
  private atMostOneTutoredGroup(groups: TutoredCourseGroup[]): TutoredCourseGroup[] {
    return groups.length > 0 ? [groups[0]] : [];
  }

  private loadContext(teacherId: number): Observable<TeacherAssignmentContextRow[]> {
    return forkJoin({
      titular: this.clasesService.getAsignaturasProfesor(teacherId).pipe(
        map((res) =>
          res.success
            ? res.data.map((row) => ({
                ...row,
                isSubstituting: false as const,
                titularTeacherId: row.idTeacher,
                isTutor: (row as TeacherAssignmentContextRow).isTutor,
              }))
            : [],
        ),
        catchError(() => of([] as TeacherAssignmentContextRow[])),
      ),
      substitutions: this.substitutionsService.getAll().pipe(
        map((res) => (res.success ? res.data : [])),
        catchError(() => of([] as AssignmentSubstitution[])),
      ),
    }).pipe(
      map(({ titular, substitutions }) => {
        const subRows = substitutions
          .filter((s) => this.isActiveSubstitutionFor(s, teacherId))
          .map((s) => this.substitutionToRow(s))
          .filter((r): r is TeacherAssignmentContextRow => r != null);
        const merged = this.mergeAssignmentRows(titular, subRows);
        const subIds = new Set(
          merged.filter((r) => r.isSubstituting).map((r) => r.id),
        );
        this.rows.set(merged);
        this.substitutingAssignmentIds.set(subIds);
        this.loadedForTeacherId = teacherId;
        return merged;
      }),
    );
  }

  private buildTutoredGroupFromAssignment(
    row: TeacherAssignmentContextRow,
  ): Observable<TutoredCourseGroup | null> {
    if (!row.idGroup || !row.idSubject) {
      return of(null);
    }
    return this.enrollments
      .getByFilters({
        idSubject: row.idSubject,
        idGroup: row.idGroup,
        schoolYear: row.schoolYear,
      })
      .pipe(
        map((res) => {
          if (!res.success || !res.data.length) {
            return null;
          }
          const studentEnrollments = res.data.map(
            (e) =>
              ({
                id: e.id,
                idStudent: e.idStudent,
                idGroup: e.idGroup,
                idSubject: e.idSubject,
                schoolYear: e.schoolYear,
                status: e.status,
                student: e.student,
                subject: row.subject,
                group: row.group,
              }) as Enrollment,
          );
          return {
            id: row.idGroup,
            grade: row.subject.grade ?? '',
            course: row.subject.course ?? { id: 0, name: '' },
            group: row.group ?? { id: row.idGroup, name: '' },
            studentEnrollments,
          };
        }),
      );
  }

  private isActiveSubstitutionFor(
    sub: AssignmentSubstitution,
    substituteTeacherId: number,
  ): boolean {
    if (sub.idSubstitute !== substituteTeacherId) {
      return false;
    }
    return sub.endDate == null || sub.endDate === '';
  }

  private substitutionToRow(
    sub: AssignmentSubstitution,
  ): TeacherAssignmentContextRow | null {
    const a: SubstitutionTeacherAssignment | undefined = sub.teacherAssignment;
    if (!a?.id || !a.subject) {
      return null;
    }
    const titular = a.teacher;
    const titularTeacherName = titular
      ? [titular.name, titular.surname].filter(Boolean).join(' ').trim()
      : undefined;

    return {
      id: a.id,
      idTeacher: a.idTeacher,
      idSubject: a.subject.id,
      idGroup: a.group?.id ?? 0,
      schoolYear: a.schoolYear,
      status: a.status,
      subject: {
        id: a.subject.id,
        name: a.subject.name,
        grade: a.subject.grade,
        course: a.subject.course,
      },
      group: a.group,
      isSubstituting: true,
      titularTeacherId: a.idTeacher,
      titularTeacherName,
      isTutor: a.isTutor,
    };
  }

  private mergeAssignmentRows(
    titular: TeacherAssignmentContextRow[],
    substituting: TeacherAssignmentContextRow[],
  ): TeacherAssignmentContextRow[] {
    const byId = new Map<number, TeacherAssignmentContextRow>();
    for (const row of titular) {
      byId.set(row.id, row);
    }
    for (const row of substituting) {
      if (!byId.has(row.id)) {
        byId.set(row.id, row);
      }
    }
    return [...byId.values()].sort((a, b) =>
      a.subject.name.localeCompare(b.subject.name, 'es'),
    );
  }

  private dedupeSchedules(schedules: WeekSchedule[]): WeekSchedule[] {
    const seen = new Set<number>();
    return schedules.filter((s) => {
      if (seen.has(s.id)) {
        return false;
      }
      seen.add(s.id);
      return true;
    });
  }

  /** Invalida caché tras cerrar/abrir sustitución en admin (misma pestaña). */
  invalidate(): void {
    this.loadedForTeacherId = null;
    this.rows.set([]);
    this.substitutingAssignmentIds.set(new Set());
  }
}
