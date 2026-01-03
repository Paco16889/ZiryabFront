import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentRegistrationRequest, StudentRegistrationResponse } from '../models/student-registration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentRegistrationService {

   private apiUrl = 'http://localhost:3000/api/registrations';

  constructor(private http: HttpClient) {}

  createRegistrations(data: StudentRegistrationRequest): Observable<StudentRegistrationResponse> {
    return this.http.post<StudentRegistrationResponse>(this.apiUrl, data);
  }
}
