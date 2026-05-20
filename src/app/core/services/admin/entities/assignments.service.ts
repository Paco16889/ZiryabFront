import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import {
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
  private readonly http = inject(HttpClient);
  private readonly courseService = inject(CourseService);

  private readonly coursesBaseUrl = `${environment.apiUrl}/courses`;
  private readonly assignmentsBaseUrl = `${environment.apiUrl}/assignments`;

  /**
   * Grades disponibles de un ciclo (`GET /api/courses/:id/grades` o fallback desde subjects).
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

  getAssignmentsByCourseAndGrade(
    idCourse: number,
    grade: string,
    schoolYear: string,
  ): Observable<CourseAssignmentsByOfferResponse> {
    return this.getAssignmentsByCourseGradeAndYear(idCourse, grade, schoolYear);
  }

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
        const gradeNorm = String(grade).trim();
        const filtered = res.data.filter((a) => {
          const sub = a.subject;
          if (!sub) {
            return false;
          }
          const courseId = sub.course?.id ?? (sub as { idCourse?: number }).idCourse;
          const subGrade = String(sub.grade ?? '').trim();
          return (
            courseId === idCourse &&
            subGrade === gradeNorm &&
            a.schoolYear === schoolYear
          );
        });
        return { success: true, data: filtered, count: filtered.length };
      }),
      catchError(() => of({ success: false, data: [] as AssignmentWithIncludes[] })),
    );
  }

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
    return this.http
      .post<AssignmentBulkCreateResponse>(`${this.assignmentsBaseUrl}/bulk`, { items })
      .pipe(
        catchError(() =>
          of({
            success: false,
            message: 'Bulk endpoint not available',
            data: {
              created: 0,
              duplicates: 0,
              skipped: items.length,
              errors: items.map((i) => ({
                idSubject: i.idSubject,
                message: 'API bulk pendiente (CURSO-94)',
              })),
            },
          }),
        ),
      );
  }

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
