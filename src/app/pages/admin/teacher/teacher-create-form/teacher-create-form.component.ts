import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-teacher-create-form',
  imports: [ReactiveFormsModule],
  templateUrl: './teacher-create-form.component.html',
  styleUrl: './teacher-create-form.component.scss'
})
export class TeacherCreateFormComponent {
  @Output() cancelCreate = new EventEmitter<void>();
  @Output() teacherCreated = new EventEmitter<void>();

  createForm: FormGroup;
  isCreating = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private teacherService: TeachersServiceService,
    private fireBaseAuth: Auth
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

  createTeacher() {
  const email = this.createForm.value.email;
  const password = this.createForm.value.password;

  // 1️⃣ Crear usuario en Firebase
  createUserWithEmailAndPassword(this.fireBaseAuth, email, password)
    .then(credential => {

      const firebaseUID = credential.user.uid;
      console.log('Firebase UID:', firebaseUID);

      // 2️⃣ Crear teacher en BBDD
      const teacherData = {
        email,
        name: this.createForm.value.name,
        surname: this.createForm.value.surname,
        ndSurname: this.createForm.value.ndSurname,
        birthDate: this.createForm.value.birthDate,
        dni: this.createForm.value.dni,
        firebaseUID   // 👈 CLAVE
      };

      this.teacherService.createTeacher(teacherData).subscribe({
        next: () => console.log('✅ Teacher creado'),
        error: err => console.error('❌ Error BBDD', err)
      });
    })
    .catch(err => {
      console.error('❌ Error Firebase', err);
    });
}


  onSubmit() {
    if (this.createForm.valid) {
    this.isCreating = true;
    this.errorMessage = '';

    // Llamar al método que ya hace Firebase + backend
    this.createTeacher();
  }
  }

  onCancel() {
    this.cancelCreate.emit();
  }
}
