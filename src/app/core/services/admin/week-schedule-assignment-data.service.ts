import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Group } from '../../models/group';
import { WeekSchedule } from '../../models/week-schedule';
import {
  SubjectTeacherAssignment,
  TeacherSubjectAssignmentRow,
} from '../../models/teacher/subjectforteacher';
import { filterTeacherAssignmentsForSchoolYear } from '../../utils/week-schedule-assignment-filters';
import { ClasesService } from '../clases.service';
import { GroupService } from './entities/group.service';
import { TeachersService } from './entities/teachers.service';
import { WeekScheduleService } from './entities/week-schedule.service';

/**
 * Orquesta las lecturas HTTP para el constructor de horarios admin: grupos
 * elegibles, asignaciones docente por grupo y profesores colindantes (mismo
 * grupo/asignatura/año).
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleAssignmentDataService {
  private readonly clases = inject(ClasesService);
  private readonly groups = inject(GroupService);
  private readonly schedules = inject(WeekScheduleService);
  private readonly teachers = inject(TeachersService);

  /**
   * Grupos que aún no tienen ninguna franja en `GET /horarios-semanales`
   * (al menos una `WeekSchedule` con `teacherAssignment.idGroup` = id del grupo).
   */
  fetchEligibleGroupsForNewSchedule(): Observable<Group[]> {
    return forkJoin({
      groups: this.groups.getAllGroups(),
      schedules: this.schedules.getAllSchedules(),
    }).pipe(
      map(({ groups, schedules }) => {
        if (!groups.success) {
          return [];
        }
        const busyIds = new Set<number>();
        if (schedules.success) {
          for (const s of schedules.data) {
            busyIds.add(s.teacherAssignment.idGroup);
          }
        }
        return groups.data.filter((g) => !busyIds.has(g.id));
      }),
      catchError(() => of([])),
    );
  }

  /**
   * Todas las filas de asignación docente (`TeacherOnSubjectOnGroup`) para un
   * grupo: agrega `GET /teachers/:id/subjects` de cada profesor, filtra por
   * `schoolYear` y estado schedulable (p. ej. ACTIVE).
   *
   * @param schoolYear - Si se omite, se usa `environment.currentSchoolYear`.
   */
  fetchAssignmentRowsForGroup(
    groupId: number,
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.fetchAllAssignmentRowsForGroupRaw(groupId).pipe(
      map((rows) => filterTeacherAssignmentsForSchoolYear(rows, schoolYear)),
    );
  }

  /**
   * `WeekSchedule` del listado global cuyo `teacherAssignment` pertenece al grupo.
   */
  fetchWeekSchedulesForGroup(groupId: number): Observable<WeekSchedule[]> {
    return this.schedules.getAllSchedules().pipe(
      map((res) => {
        if (!res.success || !res.data?.length) {
          return [];
        }
        return res.data.filter((s) => s.teacherAssignment?.idGroup === groupId);
      }),
      catchError(() => of([])),
    );
  }

  /**
   * Assignments del grupo + franjas existentes (`TeacherOnSubjectOnGroup` ↔ `WeekSchedule`).
   */
  fetchGroupScheduleContext(
    groupId: number,
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<{
    assignments: TeacherSubjectAssignmentRow[];
    weekSchedules: WeekSchedule[];
  }> {
    return forkJoin({
      assignments: this.fetchAssignmentRowsForGroup(groupId, schoolYear),
      weekSchedules: this.fetchWeekSchedulesForGroup(groupId),
    }).pipe(catchError(() => of({ assignments: [], weekSchedules: [] })));
  }

  /**
   * Filas de asignación para el grupo sin filtrar año ni estado (uso interno / debug).
   */
  private fetchAllAssignmentRowsForGroupRaw(
    groupId: number,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.teachers.getAllTeachers().pipe(
      switchMap((res) => {
        const list = res.success ? res.data : [];
        if (list.length === 0) {
          return of([]);
        }
        return forkJoin(
          list.map((t) =>
            this.fetchAssignmentsForTeacher(t.id).pipe(
              catchError(() => of([] as TeacherSubjectAssignmentRow[])),
            ),
          ),
        ).pipe(
          map((chunks) => {
            const merged = chunks
              .flat()
              .filter((r) => r.idGroup === groupId);
            const byId = new Map(merged.map((r) => [r.id, r]));
            return [...byId.values()];
          }),
        );
      }),
      catchError(() => of([])),
    );
  }

  /**
   * Filas de asignación docente para un profesor (`GET /teachers/:id/subjects`).
   */
  fetchAssignmentsForTeacher(
    teacherId: number,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.clases.getAsignaturasProfesor(teacherId).pipe(
      map((res) => res.data ?? []),
    );
  }

  /**
   * Profesores con asignación en la misma asignatura, grupo y curso escolar,
   * a partir del detalle de asignatura (`GET /subjects/:id`).
   */
  fetchPeerAssignmentsForRow(row: TeacherSubjectAssignmentRow): Observable<{
    peers: SubjectTeacherAssignment[];
    preferredPeerAssignmentId: number | null;
  }> {
    return this.clases.getNombreProfesorParaAsignatura(row.idSubject).pipe(
      map((res) => {
        const peers = (res.data?.teacherAssignments ?? []).filter(
          (ta) =>
            ta.idGroup === row.idGroup && ta.schoolYear === row.schoolYear,
        );
        const preferredPeerAssignmentId =
          peers.find((p) => p.id === row.id)?.id ?? peers[0]?.id ?? null;
        return { peers, preferredPeerAssignmentId };
      }),
    );
  }
}
