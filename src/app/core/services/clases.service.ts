import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; 

  // hace get a alumno
  getAsignaturasAlumno(studentId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/subjects`).pipe(
      map(res => res.data)
    );
  }

  // hace get a profesor
  getAsignaturasProfesor(teacherId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/teachers/${teacherId}/subjects`).pipe(
      map(res => res.data)
    );
  }

  //  recogera el nombre del profesor para ponerlo en el div de asignatura
  getNombreProfesorParaAsignatura(subjectId: number):Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/subjects/${subjectId}`).pipe(
      map(res => res.data)
    );
  }
}