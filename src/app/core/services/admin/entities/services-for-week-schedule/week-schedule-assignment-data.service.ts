import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { WeekSchedule } from '../../../../models/week-schedule';
import { TeacherSubjectAssignmentRow } from '../../../../models/teacher/subjectforteacher';
import {
  dedupeAssignmentRowsById,
  filterTeacherAssignmentsForClass,
} from '../../../../utils/week-schedule-assignment-filters';
import { assignmentWithIncludesToTeacherRow } from '../../../../utils/week-schedule-assignment-mapper';
import { AssignmentHttpService } from './teacher-assignment-http.service';
import { WeekScheduleService } from './week-schedule.service';

/**
 * Orquesta las lecturas HTTP para el constructor de horarios admin (rejilla):
 * asignaciones docente por clase agregada y franjas existentes.
 */
@Injectable({
  providedIn: 'root',
})
export class WeekScheduleAssignmentDataService {
  private readonly assignments = inject(AssignmentHttpService);
  private readonly schedules = inject(WeekScheduleService);

  /**
   * Asignaciones docente de una clase agregada (mismo criterio que el wizard de ciclos).
   */
  private fetchAssignmentRowsForClass(
    courseId: number,
    grade: string,
    groupId: number,
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.fetchAllAssignmentRowsForGroupRaw(groupId).pipe(
      map((rows) =>
        dedupeAssignmentRowsById(
          filterTeacherAssignmentsForClass(rows, courseId, grade, groupId, schoolYear),
        ),
      ),
    );
  }

  /**
   * Franjas del listado global: por grupo (con assignment) o por `label` (plantilla vacía).
   */
  private fetchWeekSchedulesForClass(
    groupId: number,
    classLabel: string,
  ): Observable<WeekSchedule[]> {
    return this.schedules.getAllSchedules().pipe(
      map((res) => {
        if (!res.success || !res.data?.length) {
          return [];
        }
        return res.data.filter((s) => {
          if (s.label === classLabel) {
            return true;
          }
          return s.teacherAssignment?.idGroup === groupId;
        });
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
    classLabel: string,
    cachedWeekSchedules?: WeekSchedule[],
  ): Observable<{
    assignments: TeacherSubjectAssignmentRow[];
    weekSchedules: WeekSchedule[];
  }> {
    const schedules$ =
      cachedWeekSchedules != null
        ? of(cachedWeekSchedules)
        : this.fetchWeekSchedulesForClass(groupId, classLabel);

    return forkJoin({
      assignments: this.fetchAssignmentRowsForClass(
        courseId,
        grade,
        groupId,
        schoolYear,
      ),
      weekSchedules: schedules$,
    }).pipe(
      map(({ assignments, weekSchedules }) => {
        const assignmentIds = new Set(assignments.map((a) => a.id));
        return {
          assignments,
          weekSchedules: weekSchedules.filter((ws) => {
            if (ws.teacherAssignment == null) {
              return ws.label === classLabel;
            }
            return assignmentIds.has(ws.teacherAssignment.id);
          }),
        };
      }),
      catchError(() => of({ assignments: [], weekSchedules: [] })),
    );
  }

  /**
   * Todas las filas de asignación del grupo vía un único `GET /api/assignments`.
   */
  private fetchAllAssignmentRowsForGroupRaw(
    groupId: number,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.assignments.getAll().pipe(
      map((res) => {
        if (!res.success || !res.data?.length) {
          return [];
        }
        return res.data
          .filter((r) => r.idGroup === groupId)
          .map((r) => assignmentWithIncludesToTeacherRow(r));
      }),
      catchError(() => of([])),
    );
  }
}
