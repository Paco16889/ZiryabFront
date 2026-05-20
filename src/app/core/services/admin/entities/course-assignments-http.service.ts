import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AssignmentWithIncludes } from '../../../models/assingment';
import { CourseService } from './course.service';

export type CourseGradesResponse = {
  success: boolean;
  data: string[];
  count?: number;
};

export type CourseSubjectsByGradeResponse = {
  success: boolean;
  data: Array<{
    id: number;
    name: string;
    grade: string;
    hours?: number;
    description?: string;
    idCourse: number;
  }>;
  count?: number;
};

export type CourseAssignmentsByOfferResponse = {
  success: boolean;
  data: AssignmentWithIncludes[];
  count?: number;
};

/**
 * Endpoints de asignaciones docentes ligados a Course (CURSO-93 / CURSO-95).
 */
@Injectable({
  providedIn: 'root',
})
export class CourseAssignmentsHttpService {
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
        catchError(() =>
          this.courseService.getCourseById(idCourse).pipe(
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
              return { success: true, data: grades, count: grades.length };
            }),
            catchError(() => of({ success: false, data: [] as string[] })),
          ),
        ),
        switchMap((apiRes) => {
          if (apiRes.success && apiRes.data.length > 0) {
            return of(apiRes);
          }
          return this.gradesFromCourseSubjects(idCourse);
        }),
      );
  }

  /**
   * Asignaturas de un ciclo + grade (`GET /api/courses/:id/subjects?grade=` o fallback).
   */
  getSubjectsByCourseAndGrade(
    idCourse: number,
    grade: string,
  ): Observable<CourseSubjectsByGradeResponse> {
    const params = new HttpParams().set('grade', grade);
    return this.http
      .get<CourseSubjectsByGradeResponse>(`${this.coursesBaseUrl}/${idCourse}/subjects`, {
        params,
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

  /**
   * Asignaciones existentes para ciclo + grade + año (filtro cliente si el back no expone ruta dedicada).
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
