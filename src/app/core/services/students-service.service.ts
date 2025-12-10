import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Student } from '../models/student';


@Injectable({
  providedIn: 'root'
})
export class StudentsServiceService {

   //url de la api
    private apiUrl = 'http://localhost:3000/api/students';

    
  constructor(private http: HttpClient) { }


  //Método que pide todos los personajes al servidor
  getStudents(): Observable<Student[]> {
     //Devuelve un Observable ( una respuesta que lleva con el tiempo)
     return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data : res)),
      catchError(() => of([]))
     );
  }

  getStudentbyId(id: number): Observable<Student>{
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }


}
