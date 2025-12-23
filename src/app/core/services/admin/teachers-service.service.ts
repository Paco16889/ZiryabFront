import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable, catchError, map, of, throwError} from 'rxjs';
import { Teacher, TeacherCreateRequest, TeacherCreateResponse, TeacherDeleteResponse } from '../../models/teacher';


@Injectable({
  providedIn: 'root'
})
export class TeachersServiceService {
       private apiUrl = 'http://localhost:3000/api/teachers';

  constructor(private http: HttpClient) { }

  getTeachers(): Observable<Teacher[]>{
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data: res)),
      catchError(() => of([]))
    );
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

  deleteTeacher(id: number):Observable<TeacherDeleteResponse> {
    return this.http.delete<TeacherDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting teacher', error);
        throw error;
      })
    );
  }
}
