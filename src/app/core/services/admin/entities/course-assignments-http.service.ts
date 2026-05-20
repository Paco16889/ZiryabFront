import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CourseService } from './course.service';

export type CourseGradesResponse = {
  success: boolean;
  data: string[];
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
