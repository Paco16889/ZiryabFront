import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GetAsignaturasAlumnoResponse, GetAsignaturasProfesorResponse, GetSubjectDetailResponse } from '../models/teacher/subjectforteacher';
import { Subject } from '../models/subject';


@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private http = inject(HttpClient);
  /**
   * URL base de la API.
   */
  private apiUrl = 'http://localhost:3000/api'; 

    /**
   * Obtiene las asignaturas en las que está matriculado un estudiante.
   * @param studentId - Identificador único del estudiante
   * @returns Observable con el array de asignaturas del estudiante
   */
  getAsignaturasAlumno(studentId: number): Observable<GetAsignaturasAlumnoResponse> {
    return this.http.get<GetAsignaturasAlumnoResponse>(`${this.apiUrl}/students/${studentId}/subjects`).pipe(
      map(res => res)
    );
  }

    /**
   * Obtiene las asignaturas que imparte un profesor.
   * @param teacherId - Identificador único del profesor
   * @returns Observable con el array de asignaturas del profesor
   */
  getAsignaturasProfesor(teacherId: number): Observable<GetAsignaturasProfesorResponse> {
    return this.http.get<GetAsignaturasProfesorResponse>(`${this.apiUrl}/teachers/${teacherId}/subjects`).pipe(
      map(res => res)
    );
  }

   /**
   * Obtiene los datos de una asignatura incluyendo la información del profesor
   * que la imparte, para mostrarla en el componente correspondiente.
   * @param subjectId - Identificador único de la asignatura
   * @returns Observable con los datos de la asignatura y su profesor
   */
  getNombreProfesorParaAsignatura(subjectId: number):Observable<GetSubjectDetailResponse>{
    return this.http.get<GetSubjectDetailResponse>(`${this.apiUrl}/subjects/${subjectId}`).pipe(
      map(res => res)
    );
  }
}