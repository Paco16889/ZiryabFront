import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Student, StudentByIdResponse,StudentsAllResponse, StudentCreateRequest, StudentCreateResponse, StudentDeleteResponse, StudentUpdateRequest, StudentUpdateResponse } from '../../models/student';


@Injectable({
  providedIn: 'root'
})
export class StudentsServiceService {

   students = signal<Student[]>([]);
   //url de la api
    private apiUrl = 'http://localhost:3000/api/students';

    
  constructor(private http: HttpClient) { }



  getAllStudents(): Observable<StudentsAllResponse>{
    return this.http.get<StudentsAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data: [], count: 0}))
    );
  }

  getStudentbyId(id: number): Observable<StudentByIdResponse>{
    return this.http.get<StudentByIdResponse>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }

 
   loadStudents() {
    this.getAllStudents().subscribe(
      response => {
        if (response) {
          this.students.set(response.data);
        } else {
          this.students.set([]);
        }
      }
    );
  }

  createStudent(data: StudentCreateRequest): Observable<StudentCreateResponse> {
    return this.http.post<StudentCreateResponse>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error Creando Estudiante:', error);
        throw error;
      })
    );
  }

  // students-service.service.ts (añade este método)
updateStudent(student: StudentUpdateRequest): Observable<StudentUpdateResponse> {
  return this.http.patch<StudentUpdateResponse>(`${this.apiUrl}/${student.id}`, student).pipe(
    catchError((error) => {
      console.error('Error Actualizando Estudiante:', error);
      throw error;
    })
  );
}

deleteStudent(id: number): Observable<StudentDeleteResponse>{

 return this.http.get<StudentDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
  catchError((error) => {
      console.error('Error Borrando Estudiante:', error);
      throw error;
    })
);
}
  
}
