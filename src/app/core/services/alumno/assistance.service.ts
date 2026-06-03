import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AssistanceResponse } from '../../models/assistance';
import { environment } from '../../../../environments/environment';

/** Respuesta simple del API para acciones de justificación de asistencia. */
interface ApiSuccessResponse<T = unknown> {
    /** Indica si la operación se completó correctamente. */
    success: boolean;
    /** Datos opcionales devueltos por el endpoint. */
    data?: T;
    /** Mensaje opcional del backend. */
    message?: string;
}

/**
 * Servicio encargado de gestionar las operaciones relacionadas con la asistencia de los alumnos.
 */
@Injectable({
    providedIn: 'root'
})
export class AssistanceService {

    /** Endpoint base de asistencias. */
    private apiUrl = `${environment.apiUrl}/assistances`;

    /**
     * Inyecta el cliente HTTP del módulo de asistencias.
     * @param http Cliente HTTP para consultar y actualizar asistencias del alumno.
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene las faltas/asistencias de un alumno concreto para su ficha.
     * @param studentId Identificador del alumno.
     * @returns Observable con las asistencias del alumno solicitado.
     */
    getAssistancesByStudentId(studentId: number): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(`${this.apiUrl}/student/${studentId}`);
    }

    /**
     * Sube el documento justificante de una ausencia.
     * @param assistanceId Registro de asistencia que se va a justificar.
     * @param file Archivo seleccionado por el alumno.
     * @returns Observable con la URI del justificante almacenado.
     */
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

    /**
     * Obtiene todas las asistencias; usado en pantallas compartidas/profesor.
     * @returns Observable con el listado completo de registros de asistencia.
     */
    getAllAssistances(): Observable<AssistanceResponse> {
        return this.http.get<AssistanceResponse>(this.apiUrl);
    }

    /**
     * Marca una ausencia como justificada desde el flujo de revisión.
     * @param assistanceId Identificador del registro de asistencia a excusar.
     * @returns Observable con la confirmación de la operación.
     */
    justifyAbsence(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.patch<ApiSuccessResponse>(`${this.apiUrl}/justify/${assistanceId}`, {});
    }

    /**
     * Rechaza una justificación y devuelve la asistencia a estado ausente.
     * @param assistanceId Identificador del registro de asistencia revisado.
     * @returns Observable con la confirmación de la operación.
     */
    rejectJustification(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.patch<ApiSuccessResponse>(`${this.apiUrl}/assistancestatus/${assistanceId}`, { status: 'ABSENT' });
    }

    /**
     * Consulta el estado de revisión del justificante de una asistencia.
     * @param assistanceId Identificador del registro de asistencia consultado.
     * @returns Observable con el estado de revisión del justificante.
     */
    getJustificationStatus(assistanceId: number): Observable<ApiSuccessResponse> {
        return this.http.get<ApiSuccessResponse>(`${this.apiUrl}/${assistanceId}/justification-status`);
    }

    /**
     * Obtiene ausencias de alumnos tutelados por el profesor autenticado.
     * @typeParam T Forma de los datos de ausencias devueltos por el endpoint del profesor.
     * @returns Observable con las ausencias agrupadas por alumno.
     */
    getStudentsAbsences<T = unknown>(): Observable<ApiSuccessResponse<T>> {
        return this.http.get<ApiSuccessResponse<T>>(`${environment.apiUrl}/teachers/my-students-absences`);
    }
}
