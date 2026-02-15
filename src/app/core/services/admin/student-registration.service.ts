import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentRegistration, StudentRegistrationRequest, StudentRegistrationResponse } from '../../models/student-registration';
import { Observable } from 'rxjs';
import { SelectedStudentServiceService } from './selected-student-service.service';
import { Student } from '../../models/student';
import { Subject } from '../../models/subject';
import { SubjectServiceService } from './entities/subject-service.service';

@Injectable({
  providedIn: 'root'
})
export class StudentRegistrationService {
  private idStudent:number | null = null;
  private idGroup: number | null = null;
  private idSubject: number | null = null;
  private cursoEscolar: string = '25/26';

   private apiUrl = 'http://localhost:3000/api/studentregistration';

  constructor(private http: HttpClient, private selectedStudent: SelectedStudentServiceService, private subjectService: SubjectServiceService) {}

  createRegistrations(data: StudentRegistrationRequest): Observable<StudentRegistrationResponse> {
    return this.http.post<StudentRegistrationResponse>(this.apiUrl, data);
  }

 registerStudent(idGroup: number) {
    const student = this.selectedStudent.selectedStudent();
    const subjects = this.subjectService.selectedSubjects();

    if (!student || subjects.length === 0) {
      return;
    }

    const registrations: StudentRegistration[] = subjects.map(subject => ({
      idStudent: student.id,
      idGroup: idGroup,
      idSubject: subject.id,
      schoolYear: '27/28'
    }));

    const request: StudentRegistrationRequest = {
      registrations
    };

    console.log('REQUEST FINAL:', request);

   return this.createRegistrations(request);
  }
  preparaDatos(){
    const subjectsForRegister = this.subjectService.selectedSubjects();

    this.idStudent = this.selectedStudent.selectedStudent()!.id;
    
    console.log('hola soy subjectsForRegister ', subjectsForRegister, this.idStudent);

    this.registerStudent(1)!
    .subscribe({
      next: (res) => {
        console.log('✅ Registro enviado correctamente:', res);
      },
      error: (err) => {
        console.error('❌ Error al registrar:', err);
      }
    });
  }
}
