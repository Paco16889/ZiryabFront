import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  PendingJustification,
  PendingJustificationsResponse,
} from '../../models/assistance';

/**
 * Servicio para que el profesor revise justificantes de faltas enviados por alumnos.
 */
@Injectable({ providedIn: 'root' })
export class TeacherJustificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/assistances`;

  getPendingJustifications(idTeacherAssignment?: number): Observable<PendingJustificationsResponse> {
    let params = new HttpParams();
    if (idTeacherAssignment != null && idTeacherAssignment > 0) {
      params = params.set('idTeacherAssignment', String(idTeacherAssignment));
    }
    return this.http.get<PendingJustificationsResponse>(
      `${this.apiUrl}/pending-justifications`,
      { params }
    );
  }

  acceptJustification(assistanceId: number): Observable<{ success: boolean; data: unknown }> {
    return this.http.patch<{ success: boolean; data: unknown }>(
      `${this.apiUrl}/justify/${assistanceId}`,
      {}
    );
  }

  rejectJustification(assistanceId: number): Observable<{ success: boolean; data: unknown }> {
    return this.http.patch<{ success: boolean; data: unknown }>(
      `${this.apiUrl}/reject-justification/${assistanceId}`,
      {}
    );
  }

  /** URL absoluta del documento de justificación servido por Express static. */
  documentUrl(justificationUri: string): string {
    const base = environment.apiUrl.replace(/\/api\/?$/, '');
    return `${base}${justificationUri}`;
  }
}
