import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Course, CourseByIdResponse, CourseCreateRequest, CourseCreateResponse, CourseDeleteResponse, CoursesAllResponse, CourseUpdateRequest, CourseUpdateResponse } from '../../../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseServiceService {

  private apiUrl = 'http://localhost:3000/api/courses';

  constructor(private http: HttpClient) { }
  courses = signal<Course[]>([]); // ← aquí guardaremos los cursos

  // Nuevo método para inicializar la signal
  loadCourses() {
    this.getAllCourses().subscribe(res => {
      if (res.success) {
        this.courses.set(res.data);
      } else {
        this.courses.set([]);
      }
    });
  }


  getAllCourses(): Observable<CoursesAllResponse> {
    return this.http.get<CoursesAllResponse>(this.apiUrl).pipe(
      catchError(() => of({ success: false, data: [], count: 0 }))
    );
  }
  getCourseById(id: number): Observable<CourseByIdResponse> {
    return this.http.get<CourseByIdResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }



  createCourse(data: CourseCreateRequest): Observable<CourseCreateResponse> {
    return this.http.post<CourseCreateResponse>(`${this.apiUrl}`, data).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
  }
  // services/course.service.ts (añade este método)
  updateCourse(data: CourseUpdateRequest): Observable<CourseUpdateResponse> {
   
    return this.http.patch<CourseUpdateResponse>(`${this.apiUrl}/${data.id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating course:', error);
        throw error;
      })
    );
  }

  deleteCourse(id: number): Observable<CourseDeleteResponse> {
    return this.http.delete<CourseDeleteResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting course:', error);
        throw error;
      })
    );
  }
}