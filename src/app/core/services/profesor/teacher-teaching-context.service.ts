import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  AssignmentSubstitution,
  SubstitutionTeacherAssignment,
} from '../../models/assignment-substitution';
import { TeacherAssignmentContextRow } from '../../models/teacher/teacher-assignment-context';
import { WeekSchedule } from '../../models/week-schedule';
import { AssignmentSubstitutionsService } from '../admin/entities/assignment-substitutions.service';
import { WeekScheduleService } from '../admin/entities/services-for-week-schedule/week-schedule.service';
import { ClasesService } from '../clases.service';

/**
 * Contexto docente del profesor autenticado: asignaciones titulares más
 * asignaciones en las que es sustituto activo (misma vista que el titular).
 */
@Injectable({
  providedIn: 'root',
})
export class TeacherTeachingContextService {
  private readonly clasesService = inject(ClasesService);
  private readonly substitutionsService = inject(AssignmentSubstitutionsService);
  private readonly weekScheduleService = inject(WeekScheduleService);

  /** Asignaciones titulares + sustituciones activas, sin duplicar por id de asignación. */
  getMyAssignmentRows(teacherId: number): Observable<TeacherAssignmentContextRow[]> {
    return forkJoin({
      titular: this.clasesService.getAsignaturasProfesor(teacherId).pipe(
        map((res) =>
          res.success
            ? res.data.map((row) => ({ ...row, isSubstituting: false as const }))
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
        return this.mergeAssignmentRows(titular, subRows);
      }),
    );
  }

  /** Horario del profesor: franjas titulares + franjas de asignaciones en sustitución. */
  getMyWeekSchedules(teacherId: number): Observable<WeekSchedule[]> {
    return this.getMyAssignmentRows(teacherId).pipe(
      switchMap((rows) => {
        const substitutingAssignmentIds = new Set(
          rows.filter((r) => r.isSubstituting).map((r) => r.id),
        );

        const byTeacher$ = this.weekScheduleService.getSchedulesByTeacher(teacherId);
        const extraSchedules$ =
          substitutingAssignmentIds.size > 0
            ? this.weekScheduleService.getAllSchedules()
            : of({ success: true, data: [] as WeekSchedule[], count: 0 });

        return forkJoin({ byTeacher: byTeacher$, extra: extraSchedules$ }).pipe(
          map(({ byTeacher, extra }) => {
            const fromTeacher = byTeacher.success ? byTeacher.data : [];
            const fromSubstitutions =
              extra.success && substitutingAssignmentIds.size > 0
                ? extra.data.filter(
                    (ws) =>
                      ws.teacherAssignment?.id != null &&
                      substitutingAssignmentIds.has(ws.teacherAssignment.id),
                  )
                : [];
            return this.dedupeSchedules([...fromTeacher, ...fromSubstitutions]);
          }),
        );
      }),
    );
  }

  /** Busca una fila de contexto por id de asignación docente. */
  findAssignmentRow(
    rows: TeacherAssignmentContextRow[],
    assignmentId: number,
  ): TeacherAssignmentContextRow | undefined {
    return rows.find((r) => r.id === assignmentId);
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
      titularTeacherName,
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
}
