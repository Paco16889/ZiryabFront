import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Student, StudentByIdResponse, StudentCreateRequest, StudentCreateResponse, StudentDeleteResponse, StudentUpdateRequest, StudentUpdateResponse } from '../../models/student';


@Injectable({
  providedIn: 'root'
})
export class StudentsServiceService {

   students = signal<Student[]>([]);
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
    return this.http.get<any>(`${this.apiUrl}/${id}`)
    .pipe(map(res => res.data));
  }

 
   loadStudents() {
    this.getStudents().subscribe(
      response => {
        if (response) {
          this.students.set(response);
        } else {
          this.students.set([]);
        }
      }
    );
  }

  createStudent(data: StudentCreateRequest): Observable<StudentCreateResponse> {
    return this.http.post<StudentCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating teacher:', error);
        throw error;
      })
    );
  }

  // students-service.service.ts (añade este método)
updateStudent(student: StudentUpdateRequest): Observable<StudentUpdateResponse> {
  return this.http.patch<StudentUpdateResponse>(`${this.apiUrl}/${student.id}`, student).pipe(
    catchError((error) => {
      console.error('Error updating student:', error);
      throw error;
    })
  );
}

deleteStudent(id: number): Observable<StudentDeleteResponse>{

 return this.http.get<StudentDeleteResponse>(`${this.apiUrl}/${id}`)
    .pipe(map(res => res));
}
  
}
