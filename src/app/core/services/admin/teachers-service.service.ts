import { HttpClient } from '@angular/common/http';
import { Injectable, signal} from '@angular/core';
import { Observable, catchError, map, of, throwError} from 'rxjs';
import { Teacher, TeacherCreateRequest, TeacherCreateResponse, TeacherDeleteResponse, TeachersAllResponse, TeacherUpdateRequest, TeacherUpdateResponse } from '../../models/teacher';


@Injectable({
  providedIn: 'root'
})
export class TeachersServiceService {
       private apiUrl = 'http://localhost:3000/api/teachers';

       teachers = signal<Teacher[]>([]);

  constructor(private http: HttpClient) { }

  loadTeachers(){
    this.getAllTeachers().subscribe(
      response => {
        if (response) {
          this.teachers.set(response.data);
        }else{
          this.teachers.set([]);
        }
      }
    )
  }

  getAllTeachers(): Observable<TeachersAllResponse>{
    return this.http.get<TeachersAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data: [], count: 0}))
    )
  }
  

  getTeacherById(id: number): Observable<Teacher>{
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createTeacher(data: TeacherCreateRequest): Observable<TeacherCreateResponse> {
  return this.http.post<TeacherCreateResponse>(this.apiUrl, data).pipe(
    catchError((error) => {
      console.error('Error creating teacher:', error);
      throw error;
    })
  );
  
}

// teachers-service.service.ts

updateTeacher(teacher: TeacherUpdateRequest): Observable<TeacherUpdateResponse> {
  return this.http.patch<TeacherUpdateResponse>(`${this.apiUrl}/${teacher.id}`, teacher ).pipe(
    catchError((error) => {
      console.error('Error updating teacher:', error);
      throw error;
    })
  );
}

  deleteTeacher(id: number):Observable<TeacherDeleteResponse> {
    return this.http.delete<TeacherDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting teacher', error);
        throw error;
      })
    );
  }
}
