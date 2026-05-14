import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AssistanceResponse } from '../../models/assistance';
import { environment } from '../../../../environments/environment';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con la asistencia de los alumnos.
 */
@Injectable({
    providedIn: 'root'
})
export class AssistanceService {

    /** URL base de la API para el recurso de asistencias */
    private apiUrl = `${environment.apiUrl}/assistances`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene el listado de asistencias asociadas a un estudiante específico.
     * @param studentId Identificador único del estudiante.
     * @returns Un observable con la respuesta de la API que contiene la lista de asistencias.
     */
    getAssistancesByStudentId(studentId: number): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(`${this.apiUrl}/student/${studentId}`);
    }


    /**
     * Sube un documento de justificación para una falta de asistencia.
     * @param assistanceId Identificador de la falta de asistencia.
     * @param file El archivo (PDF, JPG, PNG) que contiene el justificante.
     */
    submitJustification(assistanceId: number, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('document', file);
        return this.http.post(`${this.apiUrl}/${assistanceId}/justification-document`, formData);
    }

    /**
     * Obtiene todas las asistencias  */
    getAllAssistances(): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(this.apiUrl);
    }

    /**
     * Justifica una falta de asistencia (cambia su estado a EXCUSED).
     * @param assistanceId Identificador de la asistencia a justificar.
     */
    justifyAbsence(assistanceId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/justify/${assistanceId}`, {});
    }

    /**
     * Rechaza un justificante, manteniendo o cambiando la falta al estado indicado (por defecto ABSENT).
     * @param assistanceId Identificador de la asistencia.
     */
    rejectJustification(assistanceId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/assistancestatus/${assistanceId}`, { status: 'ABSENT' });
    }
}
