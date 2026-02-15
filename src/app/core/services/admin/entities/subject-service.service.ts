import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Subject, SubjectByIdResponse, SubjectCreateRequest, SubjectCreateResponse, SubjectDeleteResponse, SubjectsAllResponse, SubjectUpdateRequest, SubjectUpdateResponse } from '../../../models/subject';

@Injectable({
  providedIn: 'root'
})
export class SubjectServiceService {
  subjects = signal<Subject[]>([]);
  selectedSubjects = signal<Subject[]>([]);

     private apiUrl = 'http://localhost:3000/api/subjects';

  constructor(private http: HttpClient) { }

  
 loadSubjects() {
    this.getAllSubjects().subscribe(
      response => {
        if (response) {
          this.subjects.set(response.data);
        }else{
          this.subjects.set([]);
        }
      }
    )
  }

  loadByCourse(courseId: number): Subject[]{
    const result = this.subjects().filter(
      s => s.idCourse === courseId
    );

    return result;
  }



getAllSubjects(): Observable<SubjectsAllResponse> {
  return this.http.get<SubjectsAllResponse>(this.apiUrl).pipe(
    catchError(() => of({ success: false, data: [], count: 0 }))
  );
}

getSubjectbyId(id: number): Observable<SubjectByIdResponse> {
    return this.http.get<SubjectByIdResponse>(`${this.apiUrl}/${id}`)
    .pipe(catchError((error) => {
      console.error('Error:', error);
      throw error;
    }));
  }

  createSubject(data: SubjectCreateRequest): Observable<SubjectCreateResponse> {
    return this.http.post<SubjectCreateResponse>(`${this.apiUrl}`, data).pipe(
      catchError((error) => {
      console.error('Error:', error);
      throw error;
    })
    );
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
   //par signals
   setSelectedSubjects(subjects: Subject[]){
    
    this.selectedSubjects.set(subjects);
    console.log('aqui tenemos las selected subjects del setSelectedsubjects');
   }
}
