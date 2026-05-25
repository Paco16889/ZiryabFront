import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { WeekSchedule } from '../../../../models/week-schedule';
import { TeacherSubjectAssignmentRow } from '../../../../models/teacher/subjectforteacher';
import {
  dedupeAssignmentRowsById,
  dedupeAssignmentRowsBySubject,
  filterTeacherAssignmentsForClass,
  filterTeacherAssignmentsForSchoolYear,
  subjectMatchesClass,
} from '../../../../utils/week-schedule-assignment-filters';
import { assignmentWithIncludesToTeacherRow } from '../../../../utils/week-schedule-assignment-mapper';
import { AssignmentsService } from '../assignments.service';
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
  private readonly courseAssignments = inject(AssignmentsService);

  /**
* Filas de asignación docente para un grupo y año (`GET /api/assignments` + filtro local).
   * Descarta asignaciones no activas o de otro curso escolar antes de que lleguen al grid.
* Asignaciones docente de una clase agregada (mismo criterio que el wizard de ciclos).
   */
  private fetchAssignmentRowsForClass(
    courseId: number,
    grade: string,
    groupId: number,
    schoolYear: string = environment.currentSchoolYear,
  ): Observable<TeacherSubjectAssignmentRow[]> {
    return forkJoin({
      catalog: this.courseAssignments.getSubjectsByCourseAndGrade(courseId, grade),
      raw: this.fetchAllAssignmentRowsForGroupRaw(groupId),
    }).pipe(
      map(({ catalog, raw }) => {
        const schedulable = filterTeacherAssignmentsForSchoolYear(raw, schoolYear).filter(
          (r) => r.idGroup === groupId,
        );
        const catalogIds =
          catalog.success && catalog.data.length > 0
            ? new Set(catalog.data.map((s) => s.id))
            : null;
        const filtered =
          catalogIds != null
            ? schedulable.filter(
                (r) =>
                  catalogIds.has(r.idSubject) &&
                  subjectMatchesClass(r, courseId, grade),
              )
            : filterTeacherAssignmentsForClass(raw, courseId, grade, groupId, schoolYear);
        return dedupeAssignmentRowsById(dedupeAssignmentRowsBySubject(filtered));
      }),
    );
  }

  /**
* `WeekSchedule` del listado global cuyo `teacherAssignment` pertenece al grupo.
   * Esta lectura permite precargar el grid con el horario que ya existe en backend.
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
   * Devuelve solo asignaciones compatibles con el curso/nivel/grupo seleccionado y
   * horarios cuyas asignaciones siguen presentes en ese contexto.
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
        return res.data
          .filter((r) => r.idGroup === groupId)
          .map((r) => assignmentWithIncludesToTeacherRow(r));
      }),
      catchError(() => of([])),
    );
  }
}
