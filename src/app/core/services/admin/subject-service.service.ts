import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Subject, SubjectDeleteResponse, SubjectUpdateRequest, SubjectUpdateResponse } from '../../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectServiceService {
  

     private apiUrl = 'http://localhost:3000/api/subjects';

  constructor(private http: HttpClient) { }


getSubjects(): Observable<Subject[]> {
  return this.http.get<any>(this.apiUrl).pipe(
    map(res => ('data' in res ? res.data : res)),
    catchError(() => of([]))
  );
}

getSubjectbyId(id: number): Observable<Subject> {
    return this.http.get<any>(`${this.apiUrl}/${id}`)
    .pipe(map(res => res.data));
  }

  createSubject(data: { name: string; idCourse: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  deleteSubject(id: number): Observable<SubjectDeleteResponse>{
     return this.http.delete<SubjectDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
    catchError((error) => {
      console.error('Error deleting subject:', error);
      throw error;
    })
  );
  }

 updateSubject(id: number, data: SubjectUpdateRequest): Observable<SubjectUpdateResponse> {
  return this.http.patch<SubjectUpdateResponse>(`${this.apiUrl}/${id}`, data).pipe(
    catchError((error) => {
      console.error('Error updating subject:', error);
      throw error;
    })
  );
}
   
}
