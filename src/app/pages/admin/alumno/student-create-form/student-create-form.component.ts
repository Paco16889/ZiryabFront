import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from '../../../../core/models/student';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { PasswordServiceService } from '../../../../core/services/password-service.service';
import { BotonConfirmarStudentComponent } from "../boton-confirmar-student/boton-confirmar-student.component";
import { SelectedStudentServiceService } from '../../../../core/services/admin/selected-student-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-create-form',
  imports: [ReactiveFormsModule, BotonConfirmarStudentComponent],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss'
})
export class StudentCreateFormComponent {

  @Output() studentCreated = new EventEmitter<Student>();
  @Output() cancelCreate = new EventEmitter<void>();

  
  createForm: FormGroup;
  isCreating = false;
  errorMessage = '';
  validForm = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsServiceService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordServiceService,
    private selectedStudentService: SelectedStudentServiceService
  ) {
    this.createForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      ndSurname: ['', Validators.required],
      birthDate: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]$/)]]
    });
  }

  createStudent(): Observable<Student> {
  const email = this.createForm.value.email;
  const password = this.passwordGen.generateRandomPassword();

  console.log(password);

  this.isCreating = true;

  return new Observable<Student>((observer) => {
    createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(credential => {
        const firebaseUID = credential.user.uid;

        const studentData = {
          email,
          name: this.createForm.value.name,
          surname: this.createForm.value.surname,
          ndSurname: this.createForm.value.ndSurname,
          birthDate: this.createForm.value.birthDate,
          dni: this.createForm.value.dni,
          firebaseUID
        };

        this.studentService.createStudent(studentData).subscribe({
          next: (createdStudent) => {
            this.isCreating = false;
            observer.next(createdStudent.data);
            observer.complete();
          },
          error: (err) => {
            this.isCreating = false;
            observer.error(err);
          }
        });
      })
      .catch(err => {
        this.isCreating = false;
        observer.error(err);
      });
  });
}

  onSubmit() {
    if (this.createForm.invalid) return;
    //this.createStudent();
      const formValue = this.createForm.value;
      const dni = formValue.dni;

  // 1️⃣ comprobar existencias
    const exists = this.studentService.students().some(
    student => student.dni === dni
  );

  // 2️⃣ si existe → avisar y return
  if (exists) {
    console.log('estudiante existente');
    this.errorMessage = 'Estudiante existente matricular desde estudiante existente';
    return;
  } 
   this.createStudent().subscribe({
    next: (createdStudent) => {
      console.log('✅ Estudiante creado:', createdStudent);

      // 3️⃣ guardar en signal global
      this.selectedStudentService.setSelectedStudent(createdStudent);

      // 4️⃣ avisar al padre (si lo necesitas)
      this.studentCreated.emit(createdStudent);

      // 5️⃣ aquí NO cambiamos modo (eso lo hace el padre)
    },
    error: (err) => {
      console.error('❌ Error al crear estudiante:', err);
      this.errorMessage = 'Error al crear el estudiante';
    }
  });
  

  
  }

  onCancel() {
    this.cancelCreate.emit();
  }
}
