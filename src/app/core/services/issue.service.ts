import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Issue,
  IssueByIdResponse,
  IssueCreateRequest,
  IssueCreateResponse,
  IssueDeleteResponse,
  IssuesAllResponse,
  IssueUpdateRequest,
  IssueUpdateResponse,
} from '../models/issue';

/** Payload de actualización incluye `id`. */
export type IssueUpdatePayload = IssueUpdateRequest & { id: number };

/**
 * Servicio del tablón de anuncios (`/api/issues`). CURSO-126 / historia CURSO-125.
 */
@Injectable({
  providedIn: 'root',
})
export class IssueService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/issues`;

  readonly issues = signal<Issue[]>([]);
  readonly loading = signal(false);

  getAllIssues(): Observable<IssuesAllResponse> {
    return this.http.get<IssuesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  loadIssues(): void {
    this.loading.set(true);
    this.getAllIssues().subscribe((res) => {
      this.issues.set(res.success ? res.data : []);
      this.loading.set(false);
    });
  }

  getIssueById(id: number): Observable<IssueByIdResponse> {
    return this.http.get<IssueByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('IssueService.getIssueById', error);
        throw error;
      }),
    );
  }

  createIssue(payload: IssueCreateRequest): Observable<IssueCreateResponse> {
    return this.http.post<IssueCreateResponse>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('IssueService.createIssue', error);
        throw error;
      }),
    );
  }

  updateIssue(payload: IssueUpdatePayload): Observable<IssueUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<IssueUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('IssueService.updateIssue', error);
        throw error;
      }),
    );
  }

  deleteIssue(id: number): Observable<IssueDeleteResponse> {
    return this.http.delete<IssueDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('IssueService.deleteIssue', error);
        throw error;
      }),
    );
  }
}
