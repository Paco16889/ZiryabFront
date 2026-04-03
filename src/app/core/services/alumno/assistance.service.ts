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

    /**
     * Simula la subida de un documento de justificación. 
     * simulamos la carga exitosa (por ahora).
     */
    submitJustification(assistanceId: number, file: File): Observable<boolean> {
        return new Observable<boolean>(observer => {
            setTimeout(() => {
                console.log(`[Mock] Justificante '${file.name}' subido para la falta con ID ${assistanceId}`);
                observer.next(true);
                observer.complete();
            }, 1500);
        });
    }
}
