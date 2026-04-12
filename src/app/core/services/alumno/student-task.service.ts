import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StudentTasksAllResponse,
  StudentTaskByIdResponse,
  StudentTaskUpdateResponse
} from '../../models/studentTask';

@Injectable({
  providedIn: 'root'
})
export class StudentTaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/student-tasks';

  getAllStudentTasks(): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(this.apiUrl);
  }

  getStudentTaskById(id: number): Observable<StudentTaskByIdResponse> {
    return this.http.get<StudentTaskByIdResponse>(`${this.apiUrl}/${id}`);
  }

  getStudentTasksByTask(taskId: number): Observable<StudentTasksAllResponse> {
    return this.http.get<StudentTasksAllResponse>(`${this.apiUrl}/task/${taskId}`);
  }

  submitStudentTask(id: number, data: { attachmentUrl?: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/submit`, data);
  }

  gradeStudentTask(id: number, data: { score: number, feedback?: string }): Observable<StudentTaskUpdateResponse> {
    return this.http.put<StudentTaskUpdateResponse>(`${this.apiUrl}/${id}/grade`, data);
  }
}
