import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  Issue,
  IssueByIdResponse,
  IssueCreateRequest,
  IssueCreateResponse,
  IssueDeleteResponse,
  IssuesAllResponse,
  IssueUpdateRequest,
  IssueUpdateResponse,
} from '../../../models/issue';

/** Payload de actualización incluye `id` (lo añade el modal genérico). */
export type IssueUpdatePayload = IssueUpdateRequest & { id: number };

/**
 * Servicio admin del tablón de anuncios (`/api/issues`). CURSO-126 / historia CURSO-125.
 */
@Injectable({
  providedIn: 'root',
})
export class AdminIssueService {
  /** Cliente HTTP para el recurso `/api/issues`. */
  private readonly http = inject(HttpClient);

  /** Base URL del tablón de anuncios. */
  private readonly apiUrl = `${environment.apiUrl}/issues`;

  /** Anuncios cargados en memoria para el listado admin. */
  readonly issues = signal<Issue[]>([]);

  /** Obtiene todos los anuncios del tablón. */
  getAllIssues(): Observable<IssuesAllResponse> {
    return this.http.get<IssuesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 })),
    );
  }

  /** Recarga `issues` desde el API y actualiza el signal. */
  loadIssues(): void {
    this.getAllIssues().subscribe((res) => {
      this.issues.set(res.success ? res.data : []);
    });
  }

  /** Detalle de un anuncio por identificador. */
  getIssueById(id: number): Observable<IssueByIdResponse> {
    return this.http.get<IssueByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminIssueService.getIssueById', error);
        throw error;
      }),
    );
  }

  /** Crea un anuncio en el tablón. */
  createIssue(payload: IssueCreateRequest): Observable<IssueCreateResponse> {
    return this.http.post<IssueCreateResponse>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('AdminIssueService.createIssue', error);
        throw error;
      }),
    );
  }

  /** Actualiza un anuncio existente. */
  updateIssue(payload: IssueUpdatePayload): Observable<IssueUpdateResponse> {
    const { id, ...body } = payload;
    return this.http.patch<IssueUpdateResponse>(`${this.apiUrl}/${id}`, body).pipe(
      catchError((error) => {
        console.error('AdminIssueService.updateIssue', error);
        throw error;
      }),
    );
  }

  /** Elimina un anuncio del tablón. */
  deleteIssue(id: number): Observable<IssueDeleteResponse> {
    return this.http.delete<IssueDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('AdminIssueService.deleteIssue', error);
        throw error;
      }),
    );
  }
}
