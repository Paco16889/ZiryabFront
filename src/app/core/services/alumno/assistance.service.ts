import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssistanceResponse } from '../../models/assistance';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AssistanceService {

    private apiUrl = `${environment.apiUrl}/assistances`;

    constructor(private http: HttpClient) { }

    getAssistancesByStudentId(studentId: number): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(`${this.apiUrl}/student/${studentId}`);
    }
}
