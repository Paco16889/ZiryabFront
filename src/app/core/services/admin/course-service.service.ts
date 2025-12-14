import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Course } from '../../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseServiceService {

   private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }


  getCourses(): Observable<Course[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data : res)),
      catchError(() => of([]))
    );
  }

}