import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AssistanceResponse } from '../../models/assistance';
import { environment } from '../../../../environments/environment';

interface ApiSuccessResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * Servicio encargado de gestionar las operaciones relacionadas con la asistencia de los alumnos.
 */
@Injectable({
    providedIn: 'root'
})
export class AssistanceService {

    private apiUrl = `${environment.apiUrl}/assistances`;

    constructor(private http: HttpClient) { }

    getAssistancesByStudentId(studentId: number): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(`${this.apiUrl}/student/${studentId}`);
    }

    submitJustification(assistanceId: number, file: File): Observable<{ justificationUri: string }> {
        const formData = new FormData();
        formData.append('document', file);
        return this.http
            .post<{ success: boolean; data: { justificationUri: string } }>(
                `${this.apiUrl}/${assistanceId}/justification-document`,
                formData
            )
            .pipe(map((res) => res.data));
    }

    getAllAssistances(): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(this.apiUrl);
    }

    justifyAbsence(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.patch<ApiSuccessResponse>(`${this.apiUrl}/justify/${assistanceId}`, {});
    }

    rejectJustification(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.patch<ApiSuccessResponse>(`${this.apiUrl}/assistancestatus/${assistanceId}`, { status: 'ABSENT' });
    }

    getJustificationStatus(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.get<ApiSuccessResponse>(`${this.apiUrl}/${assistanceId}/justification-status`);
    }

    getStudentsAbsences<T = unknown>(): Observable<ApiSuccessResponse<T>> {
        return this.http.get<ApiSuccessResponse<T>>(`${environment.apiUrl}/teachers/my-students-absences`);
    }
}
