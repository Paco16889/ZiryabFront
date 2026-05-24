import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { WeekSchedule } from '../../../../models/week-schedule';
import { TeacherSubjectAssignmentRow } from '../../../../models/teacher/subjectforteacher';
import {
  filterTeacherAssignmentsForClass,
  filterTeacherAssignmentsForSchoolYear,
} from '../../../../utils/week-schedule-assignment-filters';
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
  /** Cliente de asignaciones docentes usado como fuente de asignatura/profesor/grupo. */
  private readonly assignments = inject(AssignmentHttpService);

  /** Servicio de horarios usado para leer franjas ya persistidas. */
  private readonly schedules = inject(WeekScheduleService);

  /**
   * Filas de asignación docente para un grupo y año (`GET /api/assignments` + filtro local).
   * Descarta asignaciones no activas o de otro curso escolar antes de que lleguen al grid.
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
   * Esta lectura permite precargar el grid con el horario que ya existe en backend.
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
   * Devuelve solo asignaciones compatibles con el curso/nivel/grupo seleccionado y
   * horarios cuyas asignaciones siguen presentes en ese contexto.
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
   * Todas las filas de asignación del grupo vía un único `GET /api/assignments`.
   * Se mantiene privado porque todavía no aplica filtros de año, curso ni estado.
   */
  private fetchAllAssignmentRowsForGroupRaw(
    groupId: number,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return this.assignments.getAll().pipe(
      map((res) => {
        if (!res.success || !res.data?.length) {
          return [];
        }
        return res.data.filter((r) => r.idGroup === groupId) as TeacherSubjectAssignmentRow[];
      }),
      catchError(() => of([])),
    );
  }
}
