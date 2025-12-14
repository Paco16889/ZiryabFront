import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Subject } from '../../models/subject';

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

   
}
