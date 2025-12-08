import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../models/subject'
@Injectable({
  providedIn: 'root'
})
export class SubjectServiceService {
      private apiUrl = 'http://localhost:3000/api/subjects';

  constructor(private http: HttpClient) { }

    getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);

  }
}
