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
     * Simula la subida de un documento de justificación para una falta de asistencia.
     * Actualmente es una implementación simulada (mock) que emite éxito tras un retraso.
     * @param assistanceId Identificador de la falta de asistencia que se desea justificar.
     * @param file El archivo (PDF, JPG, PNG) que contiene el justificante médico o personal.
     * @returns Un observable que emite true cuando la operación simulada se completa con éxito.
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
