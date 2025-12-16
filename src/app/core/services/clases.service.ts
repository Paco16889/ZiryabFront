import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; 

  // CORRECCIÓN: Nombre en PLURAL 'getAsignaturasAlumno'
  getAsignaturasAlumno(studentId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/subjects`).pipe(
      map(res => res.data)
    );
  }

  // Ya estaba en plural, la dejamos igual
  getAsignaturasProfesor(teacherId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/teachers/${teacherId}/subjects`).pipe(
      map(res => res.data)
    );
  }
}