import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, from, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  StudentRegistrationRequest,
  StudentRegistrationResponse,
} from '../../models/student-registration';
import { PendingStudentDraft, Student } from '../../models/student';
import { PasswordService } from '../password.service';
import { StudentsService } from './entities/students.service';
import { SubjectService } from './entities/subject.service';
import { SelectedStudentService } from './selected-student.service';

/** Códigos de error lanzados por `confirmEnrollment` cuando falla la validación o el API. */
export type EnrollmentConfirmErrorCode =
  | 'NO_SUBJECTS'
  | 'NO_STUDENT'
  | 'STUDENT_CREATE_FAILED'
  | 'REGISTRATION_FAILED';

/**
 * Orquesta matriculación (EQ-311-A): persistir solo al confirmar paso 3.
 * Huérfanos → limpieza backend (EQ-311-C). Errores propagados al UI (EQ-313).
 */
@Injectable({
  providedIn: 'root',
})
export class StudentRegistrationService {
  /** Cliente HTTP para POST de matrículas. */
  private readonly http = inject(HttpClient);

  /** Borrador o alumno seleccionado en el wizard de matriculación. */
  private readonly selectedStudent = inject(SelectedStudentService);

  /** Asignaturas elegidas en el paso 2 del wizard. */
  private readonly subjectService = inject(SubjectService);

  /** Alta de alumno en BD tras crear usuario Firebase. */
  private readonly studentsService = inject(StudentsService);

  /** Firebase Auth para registro de email/contraseña. */
  private readonly auth = inject(Auth);

  /** Generación de contraseña temporal para nuevos alumnos. */
  private readonly passwordGen = inject(PasswordService);

  /** Endpoint de matrículas en lote. */
  private readonly apiUrl = `${environment.apiUrl}/studentregistration`;

  /**
   * Persiste matrículas en lote en el backend.
   * @param data Asignaturas, grupo y alumno por cada fila de matrícula.
   */
  createRegistrations(data: StudentRegistrationRequest): Observable<StudentRegistrationResponse> {
    return this.http.post<StudentRegistrationResponse>(this.apiUrl, data);
  }

  /**
   * Confirma el paso 3: crea alumno si hay borrador y registra matrículas del grupo.
   * @param idGroup Grupo donde se matricula al alumno.
   */
  confirmEnrollment(idGroup: number): Observable<StudentRegistrationResponse> {
    const subjects = this.subjectService.selectedSubjects();
    if (subjects.length === 0) {
      return throwError(() => new Error('NO_SUBJECTS' satisfies EnrollmentConfirmErrorCode));
    }

    const draft = this.selectedStudent.pendingStudentDraft();
    if (draft) {
      return this.persistNewStudent(draft).pipe(
        switchMap((student) => this.registerStudent(idGroup, student.id)),
      );
    }

    const existing = this.selectedStudent.selectedStudent();
    if (existing) {
      return this.registerStudent(idGroup, existing.id);
    }

    return throwError(() => new Error('NO_STUDENT' satisfies EnrollmentConfirmErrorCode));
  }

  /** Crea usuario Firebase + alumno en BD y lo deja como seleccionado. */
  private persistNewStudent(draft: PendingStudentDraft): Observable<Student> {
    const password = this.passwordGen.generateRandomPassword();
    return from(createUserWithEmailAndPassword(this.auth, draft.email, password)).pipe(
      switchMap((credential) =>
        this.studentsService
          .createStudent({
            ...draft,
            firebaseUID: credential.user.uid,
          })
          .pipe(
            switchMap((response) => {
              if (!response.success) {
                return throwError(
                  () => new Error('STUDENT_CREATE_FAILED' satisfies EnrollmentConfirmErrorCode),
                );
              }
              return of(response.data as Student);
            }),
          ),
      ),
      map((student) => {
        this.selectedStudent.setSelectedStudent(student);
        return student;
      }),
    );
  }

  /** Registra matrículas del alumno en el grupo indicado. */
  private registerStudent(
    idGroup: number,
    idStudent: number,
  ): Observable<StudentRegistrationResponse> {
    const subjects = this.subjectService.selectedSubjects();
    const request: StudentRegistrationRequest = {
      registrations: subjects.map((subject) => ({
        idStudent,
        idGroup,
        idSubject: subject.id,
        schoolYear: environment.currentSchoolYear,
      })),
    };
    return this.createRegistrations(request).pipe(
      switchMap((response) => {
        if (!response.success) {
          return throwError(
            () => new Error('REGISTRATION_FAILED' satisfies EnrollmentConfirmErrorCode),
          );
        }
        return of(response);
      }),
    );
  }
}
