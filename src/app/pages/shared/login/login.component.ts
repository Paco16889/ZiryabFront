import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageAuthService } from '../../../core/services/localstorage-auth.service';
import { CommonModule } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  error = signal(false);
  loading = signal(false);
  private router: Router = inject(Router);
  readonly navigateTo: string;
  formLogin;

  constructor(
    private fb: FormBuilder,
    private auth: LocalStorageAuthService
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { navigateTo?: string } | undefined;
    this.navigateTo = state?.navigateTo ?? '/dashboard';
  }

  async onSubmit() {
  console.log('📝 Formulario:', this.formLogin.value);

  if (this.formLogin.invalid) {
    console.log('❌ Formulario inválido');
    return;
  }

  this.loading.set(true);
  this.error.set(false);

  try {
    const { email, password } = this.formLogin.value;

    // ✅ Validar que email y password existan
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // 1️⃣ Autenticar con Firebase
    console.log('🔐 Autenticando con Firebase...');
    const firebaseApp = initializeApp(environment.firebase);
    const firebaseAuth = getAuth(firebaseApp);

    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,  // ✅ TypeScript ahora sabe que no es null/undefined
      password
    );

    const firebaseUID = userCredential.user.uid;
    console.log('✅ Firebase UID obtenido:', firebaseUID);

    // 2️⃣ Obtener JWT de Node usando el UID
    console.log('🔑 Solicitando JWT a Node...');
    const response = await this.auth.login({
      firebaseUID: firebaseUID
    } as any);

    console.log('✅ Login exitoso:', response);
    console.log('📦 Token guardado');

    this.loading.set(false);
    this.router.navigate([this.navigateTo]);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    this.error.set(true);
    this.loading.set(false);
  }
}

  getError(control: string) {
    switch (control) {
      case 'email':
        if (this.formLogin.controls.email.errors != null &&
          Object.keys(this.formLogin.controls.email.errors).includes('required'))
          return 'El campo email es requerido';
        else if (this.formLogin.controls.email.errors != null &&
          Object.keys(this.formLogin.controls.email.errors).includes('email'))
          return 'El email no es correcto';
        break;
      case 'password':
        if (this.formLogin.controls.password.errors != null &&
          Object.keys(this.formLogin.controls.password.errors).includes('required'))
          return 'El campo contraseña es requerido';
        break;
      default:
        return '';
    }
    return '';
  }
}
