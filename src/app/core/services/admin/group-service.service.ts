import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from '../../models/subject';
import { catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {
   private apiUrl = 'http://localhost:3000/api/groups';
  constructor(private http: HttpClient) { }

  getSubjects(): Observable<Subject[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => ('data' in res ? res.data : res)),
      catchError(() => of([]))
    );
  }
}
