import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TasksAllResponse, TaskByIdResponse } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks';

  getAllTasks(): Observable<TasksAllResponse> {
    return this.http.get<TasksAllResponse>(this.apiUrl);
  }

  getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.apiUrl}/${id}`);
  }
}
