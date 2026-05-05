import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StudentRegistration, StudentRegistrationRequest, StudentRegistrationResponse } from '../../models/student-registration';
import { Observable } from 'rxjs';
import { SelectedStudentServiceService } from './selected-student-service.service';
import { Student } from '../../models/student';
import { Subject } from '../../models/subject';
import { SubjectServiceService } from './entities/subject-service.service';

/**
 * Servicio encargado de gestionar el proceso de matriculación de un estudiante
 * en las asignaturas y grupo correspondientes.
 * Orquesta los datos del estudiante seleccionado y las asignaturas seleccionadas
 * para construir y enviar la petición de matriculación al backend.
 */
@Injectable({
  providedIn: 'root'
})
export class StudentRegistrationService {
  /**
   * Identificador del estudiante a matricular.
   */
  private idStudent:number | null = null;
 

  /**
   * URL base del endpoint de matriculaciones.
   */
   private apiUrl = 'http://localhost:3000/api/studentregistration';

 /**
   * Inicializa el servicio.
   * @param auth - Instancia de Auth de Firebase para obtener el token actual
   * @param http - Cliente HTTP de Angular para realizar peticiones al backend
   * @param subjectService - Servicio para obtener la asignaturas seleccionadas
   * @param studentSelectedService - Servicio para obtener el estudiante seleccionado
   */
  constructor(private http: HttpClient, private selectedStudent: SelectedStudentServiceService, private subjectService: SubjectServiceService) {}

   /**
   * Envía la petición de matriculación al backend.
   * @param data - Datos de matriculación que incluyen el array de registros
   * @returns Observable con la respuesta de confirmación de matriculación
   */
  createRegistrations(data: StudentRegistrationRequest): Observable<StudentRegistrationResponse> {
    return this.http.post<StudentRegistrationResponse>(this.apiUrl, data);
  }

   /**
   * Construye y envía las matriculaciones del estudiante seleccionado
   * en todas las asignaturas seleccionadas para el grupo indicado.
   * Si no hay estudiante o asignaturas seleccionadas no realiza ninguna acción.
   * @param idGroup - Identificador del grupo en el que se matricula el estudiante
   * @returns Observable con la respuesta de matriculación o void si faltan datos
   */
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

  /**
   * Prepara y ejecuta el proceso completo de matriculación utilizando
   * el estudiante y las asignaturas actualmente seleccionados en sus respectivas signals.
   * Llama a registerStudent con el grupo por defecto y gestiona la respuesta.
   */
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
