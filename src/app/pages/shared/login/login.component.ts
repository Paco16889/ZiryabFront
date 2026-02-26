import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // CAMBIO: Usar AuthService
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


/**
 * Componente que gestiona el formulario de inicio de sesión.
 * Autentica al usuario mediante Firebase y el backend,
 * y redirige según el rol al dashboard correspondiente.
 */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

   /**
   * Indica si ha ocurrido un error durante el inicio de sesión.
   */
  error = signal(false);

  /**
   * Indica si la petición de inicio de sesión está en curso.
   */
  loading = signal(false);

  /**
   * Router de Angular para gestionar las redirecciones tras el login.
   */
  private router: Router = inject(Router);

  /**
   * Formulario reactivo con los campos email y contraseña.
   */
  formLogin;

   /**
   * @param fb - FormBuilder de Angular para construir el formulario reactivo
   * @param authService - Servicio de autenticación que gestiona Firebase y el backend
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService // CAMBIO: Inyectar AuthService
  ) {
    // Si ya está autenticado, redirigir a dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }

    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
     if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole(); // obtener rol
      if (role === 'ADMIN') {
        this.router.navigate(['/dashboard-admin']); // admin va a dashboard-admin
      } else {
        this.router.navigate(['/dashboard']); // otros roles van a dashboard
      }
    }
  }

   /**
   * Valida el formulario y ejecuta el inicio de sesión.
   * Redirige a dashboard-admin si el rol es ADMIN, o a dashboard en cualquier otro caso.
   */
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

      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      console.log('🔐 Iniciando sesión con AuthService...');

      // CAMBIO: Usar AuthService.login() que maneja todo (Firebase + Backend)
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          console.log('📦 Token guardado en jwtToken');
          
          this.loading.set(false);
          
          // Redirigir a dashboard limpiando query params
          
             const role = response.role; // obtener rol del usuario logueado
          if (role === 'ADMIN') {
            this.router.navigate(['/dashboard-admin']); // admin va a dashboard-admin
          } else {
            this.router.navigate(['/dashboard']); // otros roles van a dashboard
          }

        },
        error: (error) => {
          console.error('❌ Error en login:', error);
          this.error.set(true);
          this.loading.set(false);
        }
      });

    } catch (error: any) {
      console.error('❌ Error:', error.message);
      this.error.set(true);
      this.loading.set(false);
    }
  }

   /**
   * Devuelve el mensaje de error correspondiente al campo indicado.
   * Pendiente de sustituir los textos hardcodeados por el sistema de traducciones.
   * @param control - Nombre del campo del formulario a validar
   * @returns Mensaje de error o cadena vacía si no hay error
   */
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