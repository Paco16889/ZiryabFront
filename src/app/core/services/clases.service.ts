import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private http=inject(HttpClient);
  private apiUrl='http://localhost:3000/api'

  getAsignaturaAlumno(studentId: number):Observable<any[]>{
    return this.http.get<any>(`${this.apiUrl}/students/${studentId}/subjects`).pipe(
      map(response => response.data)
    );
  }
  getAsignaturasProfesor(teacherId: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/teachers/${teacherId}/subjects`).pipe(
      map(res => res.data)
    );
  }

  constructor() { }
}
