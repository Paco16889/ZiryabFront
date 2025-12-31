import { Component, EventEmitter, Output } from '@angular/core';
import { Student } from '../../../../core/models/student';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentsServiceService } from '../../../../core/services/admin/students-service.service';
import { Auth } from '@angular/fire/auth';
import { PasswordServiceService } from '../../../../core/services/password-service.service';

@Component({
  selector: 'app-student-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './student-create-form.component.html',
  styleUrl: './student-create-form.component.scss'
})
export class StudentCreateFormComponent {

  @Output() studentCreated = new EventEmitter<Student>();
  @Output() cancelCreate = new EventEmitter<void>();

  
  createForm: FormGroup;
  isCreating = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentsServiceService,
    private fireBaseAuth: Auth,
    private passwordGen: PasswordServiceService
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
/*
  private createStudent() {
    const email = this.createForm.value.email;
    const password = this.passwordGen.generateRandomPassword();

    this.isCreating = true;
    this.errorMessage = '';

    // 1️⃣ Crear usuario en Firebase
    createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
      .then(credential => {

        const firebaseUID = credential.user.uid;

        // 2️⃣ Crear alumno en BBDD
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
          next: (response) => {
            this.isCreating = false;
            this.studentCreated.emit(response.data);
          },
          error: err => {
            this.isCreating = false;
            this.errorMessage = err.error?.message || 'Error al crear el alumno';
          }
        });
      })
      .catch(err => {
        this.isCreating = false;
        this.errorMessage = err.message || 'Error al crear usuario en Firebase';
      });
  }

 
    */

   onSubmit() {
    if (this.createForm.invalid) return;
    //this.createStudent();
  }

  onCancel() {
    this.cancelCreate.emit();
  }
}
