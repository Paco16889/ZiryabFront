import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; // CAMBIO: Usar AuthService
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


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
   * Indica si queremos ver la contraseña en texto plano.
   */
  showPassword = signal(false);

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);

  /**
   * Formulario reactivo con los campos email y contraseña.
   */
  formLogin = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

   /**
   * Inicializa el componente y redirige si ya está autenticado.
   */
  constructor() {
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role === 'ADMIN') {
        this.router.navigate(['/dashboard-admin']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    }
  }

  /**
   * Refresca la visibilidad de la contraseña.
   */
  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

   /**
   * Valida el formulario y ejecuta el inicio de sesión.
   * Redirige a dashboard-admin si el rol es ADMIN, o a dashboard en cualquier otro caso.
   */
  async onSubmit() {
    console.log('Formulario:', this.formLogin.value);

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

      console.log('Iniciando sesión con AuthService...');

      // Inicio de sesión mediante AuthService (Firebase + Backend con Cookies)
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          console.log('Sesión establecida mediante cookies segura');
          
          this.loading.set(false);
          
          // Redirigir a dashboard
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
   * Utiliza el sistema de traducciones para los textos.
   * @param control - Nombre del campo del formulario a validar
   * @returns Mensaje de error o cadena vacía si no hay error
   */
  getError(control: string) {
    switch (control) {
      case 'email':
        if (this.formLogin.controls.email.errors?.['required'])
          return this.translateService.instant('common.validation.required');
        else if (this.formLogin.controls.email.errors?.['email'])
          return this.translateService.instant('common.validation.emailInvalid');
        break;
      case 'password':
        if (this.formLogin.controls.password.errors?.['required'])
          return this.translateService.instant('common.validation.required');
        break;
      default:
        return '';
    }
    return '';
  }
}