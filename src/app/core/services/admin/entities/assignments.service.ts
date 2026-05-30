import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  AssignmentBulkApiResponse,
  AssignmentBulkCreateItem,
  AssignmentBulkCreateResponse,
  CourseAssignmentsByOfferResponse,
  CourseGradesResponse,
  CourseSubjectsByGradeResponse,
} from '../../../models/course-assignments/course-assignments-api.model';
import {
  AssignmentCreateRequest,
  AssignmentCreateResponse,
  AssignmentWithIncludes,
} from '../../../models/assingment';
import { environment } from '../../../../../environments/environment';
import { normalizeGradeValue } from '../../../utils/week-schedule-assignment-filters';
import { CourseService } from './course.service';

/**
 * Servicio admin de asignaciones docentes desde Course (CURSO-93 / CURSO-99).
 *
 * `getGradesByCourse` devuelve los valores **distinct** de `Subject.grade`
 * del catálogo de asignaturas de ese ciclo (no confundir con grupos ni turnos).
 */
@Injectable({
  providedIn: 'root',
})
export class AssignmentsService {
  /** Cliente HTTP para endpoints de cursos y asignaciones. */
  private readonly http = inject(HttpClient);

  /** Fallback que permite derivar grades/asignaturas desde el detalle del curso. */
  private readonly courseService = inject(CourseService);

  /** Endpoint base de cursos, usado para grades y subjects por ciclo. */
  private readonly coursesBaseUrl = `${environment.apiUrl}/courses`;

  /** Endpoint base de asignaciones docentes. */
  private readonly assignmentsBaseUrl = `${environment.apiUrl}/assignments`;

  /**
   * Grades disponibles de un ciclo (`GET /api/courses/:id/grades` o fallback desde subjects).
   *
   * @param idCourse - Ciclo del que se extraen los valores distintos de `Subject.grade`
   */
  getGradesByCourse(idCourse: number): Observable<CourseGradesResponse> {
    return this.http
      .get<CourseGradesResponse>(`${this.coursesBaseUrl}/${idCourse}/grades`)
      .pipe(
        catchError(() => this.gradesFromCourseSubjects(idCourse)),
        switchMap((apiRes) => {
          if (apiRes.success && apiRes.data.length > 0) {
            return of(apiRes);
          }
          return this.gradesFromCourseSubjects(idCourse);
        }),
      );
  }

  /**
   * Asignaturas de un ciclo y grade para alimentar una fila por asignatura en el grid.
   */
  getSubjectsByCourseAndGrade(
    idCourse: number,
    grade: string,
  ): Observable<CourseSubjectsByGradeResponse> {
    return this.http
      .get<CourseSubjectsByGradeResponse>(`${this.coursesBaseUrl}/${idCourse}/subjects`, {
        params: { grade },
      })
      .pipe(
        catchError(() => this.subjectsFromCourse(idCourse, grade)),
        switchMap((apiRes) => {
          if (apiRes.success && apiRes.data.length > 0) {
            return of(apiRes);
          }
          return this.subjectsFromCourse(idCourse, grade);
        }),
      );
  }

  /** Alias semántico usado por componentes del flujo ciclo+grade. */
  getAssignmentsByCourseAndGrade(
    idCourse: number,
    grade: string,
    schoolYear: string,
  ): Observable<CourseAssignmentsByOfferResponse> {
    return this.getAssignmentsByCourseGradeAndYear(idCourse, grade, schoolYear);
  }

  /**
   * Filtra asignaciones existentes por ciclo, grade y año escolar usando las relaciones incluidas.
   */
  getAssignmentsByCourseGradeAndYear(
    idCourse: number,
    grade: string,
    schoolYear: string,
  ): Observable<CourseAssignmentsByOfferResponse> {
    return this.http.get<CourseAssignmentsByOfferResponse>(this.assignmentsBaseUrl).pipe(
      map((res) => {
        if (!res.success) {
          return { success: false, data: [] as AssignmentWithIncludes[] };
        }
        const gradeNorm = normalizeGradeValue(grade);
        const filtered = res.data.filter((a) => {
          const sub = a.subject;
          if (!sub) {
            return false;
          }
          const courseId = sub.course?.id ?? (sub as { idCourse?: number }).idCourse;
          return (
            courseId === idCourse &&
            normalizeGradeValue(sub.grade ?? '') === gradeNorm &&
            a.schoolYear === schoolYear
          );
        });
        return { success: true, data: filtered, count: filtered.length };
      }),
      catchError(() => of({ success: false, data: [] as AssignmentWithIncludes[] })),
    );
  }

  /** Crea una asignación docente individual. */
  createAssignment(payload: AssignmentCreateRequest): Observable<AssignmentCreateResponse> {
    return this.http.post<AssignmentCreateResponse>(this.assignmentsBaseUrl, payload).pipe(
      catchError((error) => {
        console.error('AssignmentsService.createAssignment', error);
        throw error;
      }),
    );
  }

  /**
   * Alta masiva (`POST /api/assignments/bulk`). Si el back aún no expone la ruta, devuelve `success: false`.
   */
  createAssignmentsBulk(
    items: AssignmentBulkCreateItem[],
  ): Observable<AssignmentBulkCreateResponse> {
    if (items.length === 0) {
      return of({
        success: true,
        data: { created: 0, duplicates: 0, skipped: 0, errors: [] },
      });
    }

    return this.http
      .post<AssignmentBulkApiResponse>(`${this.assignmentsBaseUrl}/bulk`, {
        assignments: items,
      })
      .pipe(
        map((res) => this.mapBulkApiResponse(res, items)),
        switchMap((mapped) => {
          if (mapped.success && mapped.data && mapped.data.created + mapped.data.duplicates > 0) {
            return of(mapped);
          }
          return this.createAssignmentsSequential(items);
        }),
        catchError(() => this.createAssignmentsSequential(items)),
      );
  }

  /** Respuesta cruda del back (`POST /assignments/bulk`). */
  private mapBulkApiResponse(
    res: AssignmentBulkApiResponse,
    items: AssignmentBulkCreateItem[],
  ): AssignmentBulkCreateResponse {
    if (!res.success || !res.data) {
      return {
        success: false,
        data: { created: 0, duplicates: 0, skipped: 0, errors: [] },
        message: res.message,
      };
    }

    const created = Array.isArray(res.data.created) ? res.data.created.length : 0;
    const duplicates = Array.isArray(res.data.duplicates) ? res.data.duplicates.length : 0;
    const errors = (res.data.errors ?? []).map((e) => ({
      idSubject: e.input?.idSubject ?? items[e.index]?.idSubject ?? 0,
      message: e.message,
    }));

    return {
      success: created > 0 || duplicates > 0,
      message: res.message,
      data: { created, duplicates, skipped: 0, errors },
    };
  }

  /** Fallback cuando `POST /bulk` no existe: altas unitarias en paralelo. */
  private createAssignmentsSequential(
    items: AssignmentBulkCreateItem[],
  ): Observable<AssignmentBulkCreateResponse> {
    return forkJoin(
      items.map((item) =>
        this.createAssignment({
          idTeacher: item.idTeacher,
          idSubject: item.idSubject,
          idGroup: item.idGroup,
          schoolYear: item.schoolYear,
          isTutor: item.isTutor,
        }).pipe(
          map(() => ({ ok: true as const, idSubject: item.idSubject })),
          catchError((err: { status?: number }) =>
            of({
              ok: false as const,
              idSubject: item.idSubject,
              duplicate: err?.status === 409,
            }),
          ),
        ),
      ),
    ).pipe(
      map((results) => {
        let created = 0;
        let duplicates = 0;
        const errors: Array<{ idSubject: number; message: string }> = [];

        for (const r of results) {
          if (r.ok) {
            created++;
          } else if (r.duplicate) {
            duplicates++;
          } else {
            errors.push({ idSubject: r.idSubject, message: 'Error al crear' });
          }
        }

        return {
          success: created > 0 || duplicates > 0,
          data: { created, duplicates, skipped: 0, errors },
        };
      }),
    );
  }

  /** Fallback para obtener asignaturas del curso cuando no existe endpoint por grade. */
  private subjectsFromCourse(
    idCourse: number,
    grade: string,
  ): Observable<CourseSubjectsByGradeResponse> {
    const gradeNorm = String(grade).trim();
    return this.courseService.getCourseById(idCourse).pipe(
      map((res) => {
        if (!res.success || !res.data?.subjects?.length) {
          return { success: false, data: [] };
        }
        const data = res.data.subjects
          .filter((s) => String(s.grade ?? '').trim() === gradeNorm)
          .map((s) => ({
            id: s.id,
            name: s.name,
            grade: String(s.grade),
            hours: s.hours,
            description: s.description,
            idCourse: s.idCourse,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return { success: data.length > 0, data, count: data.length };
      }),
      catchError(() => of({ success: false, data: [] })),
    );
  }

  /** Fallback para derivar los grades disponibles desde `course.subjects`. */
  private gradesFromCourseSubjects(idCourse: number): Observable<CourseGradesResponse> {
    return this.courseService.getCourseById(idCourse).pipe(
      map((res) => {
        if (!res.success || !res.data?.subjects?.length) {
          return { success: false, data: [] as string[] };
        }
        const grades = [
          ...new Set(
            res.data.subjects
              .map((s) => String(s.grade ?? '').trim())
              .filter((g) => g.length > 0),
          ),
        ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        return { success: grades.length > 0, data: grades, count: grades.length };
      }),
      catchError(() => of({ success: false, data: [] as string[] })),
    );
  }
}
