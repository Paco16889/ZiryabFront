import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
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
    return this.http
      .get<GetByTutorResponse>(`${this.apiUrl}/tutor/${idTutor}`)
      .pipe(
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
}
