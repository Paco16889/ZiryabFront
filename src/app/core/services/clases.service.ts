import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {
  private http=inject(HttpClient);
  private apiUrl='http://localhost:4200/api/students'

  getAsignaturaAlumno(studentId: number):Observable<any[]>{
    return this.http.get<any>(`${this.apiUrl}/${studentId}/subjects`).pipe(
      map(response => response.data)
    );
  }

  constructor() { }
}
