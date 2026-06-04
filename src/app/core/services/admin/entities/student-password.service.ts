import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GetByTutorResponse } from '../../../models/student-password';

/**
 * Servicio admin/profesor para consultar credenciales de alumnos por tutor.
 */
@Injectable({
  providedIn: 'root',
})
export class StudentPasswordService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/student-passwords`;

  getByTutor(idTutor: number): Observable<GetByTutorResponse> {
    return this.http.get<GetByTutorResponse>(`${this.apiUrl}/tutor/${idTutor}`).pipe(
      map((res) => ({
        success: res.success !== false,
        data: (res.data ?? []).filter(
          (row) =>
            Number.isFinite(row.idStudent) &&
            Number.isFinite(row.idTutor) &&
            row.studentName.length > 0,
        ),
      })),
      catchError((error) => {
        console.error('StudentPasswordService.getByTutor', error);
        throw error;
      }),
    );
  }

  save(idStudent: number, password: string): Observable<unknown> {
    return this.http
      .post(`${this.apiUrl}`, { idStudent, password })
      .pipe(
        catchError((error) => {
          console.error('StudentPasswordService.save', error);
          throw error;
        }),
      );
  }

  /** Asigna el tutor tras matricular (credencial visible en tablón del tutor). */
  patchTutor(idStudent: number, idTutor: number): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/${idStudent}`, { idTutor }).pipe(
      catchError((error) => {
        console.error('StudentPasswordService.patchTutor', error);
        throw error;
      }),
    );
  }
}
