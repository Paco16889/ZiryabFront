import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { WeekSchedule } from '../../models/week-schedule';
import { TeacherSubjectAssignmentRow } from '../../models/teacher/subjectforteacher';
import {
  filterTeacherAssignmentsForClass,
  filterTeacherAssignmentsForSchoolYear,
} from '../../utils/week-schedule-assignment-filters';
import { ClasesService } from '../clases.service';
import { TeachersService } from './entities/teachers.service';
import { WeekScheduleService } from './entities/week-schedule.service';

/**
 * Orquesta las lecturas HTTP para el constructor de horarios admin (rejilla):
 * asignaciones docente por clase agregada y franjas existentes.
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleAssignmentDataService {
  private readonly clases = inject(ClasesService);
  private readonly schedules = inject(WeekScheduleService);
  private readonly teachers = inject(TeachersService);

  /**
   * Todas las filas de asignación docente (`TeacherOnSubjectOnGroup`) para un
   * grupo: agrega `GET /teachers/:id/subjects` de cada profesor, filtra por
   * `schoolYear` y estado schedulable (p. ej. ACTIVE).
   *
   * @param schoolYear - Si se omite, se usa `environment.currentSchoolYear`.
   */
  private fetchAssignmentRowsForGroup(
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
  private fetchWeekSchedulesForGroup(groupId: number): Observable<WeekSchedule[]> {
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
   * Contexto del builder para una clase `(course, grade, group, schoolYear)`.
   */
  fetchClassScheduleContext(
    courseId: number,
    grade: string,
    groupId: number,
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<{
    assignments: TeacherSubjectAssignmentRow[];
    weekSchedules: WeekSchedule[];
  }> {
    return forkJoin({
      assignments: this.fetchAssignmentRowsForGroup(groupId, schoolYear).pipe(
        map((rows) =>
          filterTeacherAssignmentsForClass(rows, courseId, grade, groupId, schoolYear),
        ),
      ),
      weekSchedules: this.fetchWeekSchedulesForGroup(groupId),
    }).pipe(
      map(({ assignments, weekSchedules }) => {
        const assignmentIds = new Set(assignments.map((a) => a.id));
        return {
          assignments,
          weekSchedules: weekSchedules.filter((ws) =>
            assignmentIds.has(ws.teacherAssignment.id),
          ),
        };
      }),
      catchError(() => of({ assignments: [], weekSchedules: [] })),
    );
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
  private fetchAssignmentsForTeacher(
    teacherId: number,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.clases.getAsignaturasProfesor(teacherId).pipe(
      map((res) => res.data ?? []),
    );
  }
}
