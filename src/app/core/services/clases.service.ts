import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetAsignaturasAlumnoResponse, GetAsignaturasProfesorResponse, GetSubjectDetailResponse } from '../models/teacher/subjectforteacher';
import { StudentsBySubjectResponse } from '../models/student-by-subject';

/**
 * Servicio encargado de obtener las asignaturas de alumnos y profesores,
 * así como la información de los profesores asociados a cada asignatura.
 */
@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  /**
   * Cliente HTTP de Angular para realizar las peticiones a la API.
   */
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
    return this.http.get<GetAsignaturasAlumnoResponse>(`${this.apiUrl}/students/${studentId}/subjects`);
  }

    /**
   * Obtiene las asignaturas que imparte un profesor.
   * @param teacherId - Identificador único del profesor
   * @returns Observable con el array de asignaturas del profesor
   */
  getAsignaturasProfesor(teacherId: number): Observable<GetAsignaturasProfesorResponse> {
    return this.http.get<GetAsignaturasProfesorResponse>(`${this.apiUrl}/teachers/${teacherId}/subjects`);
  }

   /**
   * Obtiene los datos de una asignatura incluyendo la información del profesor
   * que la imparte, para mostrarla en el componente correspondiente.
   * @param subjectId - Identificador único de la asignatura
   * @returns Observable con los datos de la asignatura y su profesor
   */
  getNombreProfesorParaAsignatura(subjectId: number):Observable<GetSubjectDetailResponse>{
    return this.http.get<GetSubjectDetailResponse>(`${this.apiUrl}/subjects/${subjectId}`);
  }

  /**
   * Obtiene los alumnos matriculados en una asignatura.
   * Incluye el id de matrícula (StudentOnSubjectOnGroup.id) necesario para registrar asistencia.
   * @param subjectId - Identificador único de la asignatura
   * @returns Observable con el array de alumnos matriculados
   */
  getStudentsBySubject(subjectId: number): Observable<StudentsBySubjectResponse> {
    return this.http.get<StudentsBySubjectResponse>(`${this.apiUrl}/subjects/${subjectId}/students`);
  }
}