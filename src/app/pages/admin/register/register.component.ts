import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageAuthService } from '../../../core/services/localstorage-auth.service';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  error = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  private router: Router = inject(Router);
  formRegister;

  constructor(
    private fb: FormBuilder,
    private auth: LocalStorageAuthService
  ) {
    this.formRegister = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      ndSurname: [''],
      birthDate: ['', [Validators.required]],
      dni: ['', [Validators.required]],
      role: ['STUDENT', [Validators.required]]
    });
  }

  async onSubmit() {
    console.log('📝 Formulario:', this.formRegister.value);

    if (this.formRegister.invalid) {
      console.log('❌ Formulario inválido');
      return;
    }

    this.loading.set(true);
    this.error.set(false);
    this.errorMessage.set('');

    try {
      const { email, password, name, surname, ndSurname, birthDate, dni, role } = this.formRegister.value;

      // ✅ Validar que email y password existan
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      // 1️⃣ Crear usuario en Firebase
      console.log('🔐 Creando usuario en Firebase...');
      const firebaseApp = initializeApp(environment.firebase);
      const firebaseAuth = getAuth(firebaseApp);

      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );

      const firebaseUID = userCredential.user.uid;
      console.log('✅ Usuario creado en Firebase:', firebaseUID);

      // 2️⃣ Registrar usuario en BD local
      console.log('📝 Registrando usuario en BD local...');
      const response = await this.auth.register({
        firebaseUID: firebaseUID,
        email: email,
        name: name,
        surname: surname,
        ndSurname: ndSurname || null,
        birthDate: birthDate,
        dni: dni,
        role: role
      } as any);

      console.log('✅ Registro exitoso:', response);

      this.loading.set(false);
      
      // Mostrar mensaje de éxito y limpiar formulario
      alert('✅ Usuario registrado correctamente');
      this.formRegister.reset({ role: 'STUDENT' });

    } catch (error: any) {
      console.error('❌ Error:', error.message);
      this.errorMessage.set(error.message);
      this.error.set(true);
      this.loading.set(false);
    }
  }

  getError(control: string) {
    switch (control) {
      case 'email':
        if (this.formRegister.controls.email.errors != null &&
          Object.keys(this.formRegister.controls.email.errors).includes('required'))
          return 'El campo email es requerido';
        else if (this.formRegister.controls.email.errors != null &&
          Object.keys(this.formRegister.controls.email.errors).includes('email'))
          return 'El email no es correcto';
        break;
      case 'password':
        if (this.formRegister.controls.password.errors != null &&
          Object.keys(this.formRegister.controls.password.errors).includes('required'))
          return 'El campo contraseña es requerido';
        else if (this.formRegister.controls.password.errors != null &&
          Object.keys(this.formRegister.controls.password.errors).includes('minlength'))
          return 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'name':
        if (this.formRegister.controls.name.errors != null &&
          Object.keys(this.formRegister.controls.name.errors).includes('required'))
          return 'El campo nombre es requerido';
        break;
      case 'surname':
        if (this.formRegister.controls.surname.errors != null &&
          Object.keys(this.formRegister.controls.surname.errors).includes('required'))
          return 'El campo apellido es requerido';
        break;
      case 'birthDate':
        if (this.formRegister.controls.birthDate.errors != null &&
          Object.keys(this.formRegister.controls.birthDate.errors).includes('required'))
          return 'La fecha de nacimiento es requerida';
        break;
      case 'dni':
        if (this.formRegister.controls.dni.errors != null &&
          Object.keys(this.formRegister.controls.dni.errors).includes('required'))
          return 'El DNI es requerido';
        break;
      default:
        return '';
    }
    return '';
  }
}
