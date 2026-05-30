import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AssignmentSubstitution,
  AssignmentSubstitutionByIdResponse,
  AssignmentSubstitutionCloseRequest,
  AssignmentSubstitutionCloseResponse,
  AssignmentSubstitutionCreateRequest,
  AssignmentSubstitutionCreateResponse,
  AssignmentSubstitutionsListResponse,
} from '../../../models/assignment-substitution';

/**
 * Servicio admin de sustituciones docentes (`/api/assignment-substitutions`).
 */
@Injectable({
  providedIn: 'root',
})
export class AssignmentSubstitutionsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/assignment-substitutions`;

  readonly substitutions = signal<AssignmentSubstitution[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal(false);

  getAll(): Observable<AssignmentSubstitutionsListResponse> {
    return this.http.get<AssignmentSubstitutionsListResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  loadSubstitutions(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.getAll().subscribe({
      next: (res) => {
        this.loading.set(false);
        if (!res.success) {
          this.loadError.set(true);
          this.substitutions.set([]);
          return;
        }
        this.substitutions.set(res.data);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
        this.substitutions.set([]);
      },
    });
  }

  getById(id: number): Observable<AssignmentSubstitutionByIdResponse> {
    return this.http.get<AssignmentSubstitutionByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AssignmentSubstitutionsService.getById', error);
        throw error;
      }),
    );
  }

  getByAssignment(assignmentId: number): Observable<AssignmentSubstitutionsListResponse> {
    return this.http
      .get<AssignmentSubstitutionsListResponse>(`${this.apiUrl}/assignment/${assignmentId}`)
      .pipe(
        catchError(() => of({ success: false, data: [], count: 0 })),
      );
  }

  create(
    payload: AssignmentSubstitutionCreateRequest,
  ): Observable<AssignmentSubstitutionCreateResponse> {
    return this.http.post<AssignmentSubstitutionCreateResponse>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('AssignmentSubstitutionsService.create', error);
        throw error;
      }),
    );
  }

  close(
    id: number,
    payload: AssignmentSubstitutionCloseRequest,
  ): Observable<AssignmentSubstitutionCloseResponse> {
    return this.http
      .patch<AssignmentSubstitutionCloseResponse>(`${this.apiUrl}/${id}/close`, payload)
      .pipe(
        catchError((error) => {
          console.error('AssignmentSubstitutionsService.close', error);
          throw error;
        }),
      );
  }
}
