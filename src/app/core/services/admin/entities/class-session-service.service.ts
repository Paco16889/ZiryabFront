import { Injectable, signal } from '@angular/core';
import { ClassSession, ClassSessionByIdResponse, ClassSessionesAllResponse } from '../../../models/class-sessions';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClassSessionServiceService {

  classSessions= signal<ClassSession[]>([]);
  private apiUrl = 'http://localhost:3000/api/sessions';

  constructor(private http: HttpClient) { }

  loadSessions(){
    this.getAllSessions().subscribe(res => {
      if (res.success) {
        this.classSessions.set(res.data);
      } else {
        this.classSessions.set([]);
      }
    });
  }

  getAllSessions(): Observable<ClassSessionesAllResponse>{
    return this.http.get<ClassSessionesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({success: false, data:[], count: 0}))
    );
  }

  getSessionById(id: number):Observable<ClassSessionByIdResponse>{
    return 
  }

  updateSession():Observable<
 
}
