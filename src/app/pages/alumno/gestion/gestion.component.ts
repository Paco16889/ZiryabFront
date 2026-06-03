import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra el menú de gestión académica del estudiante.
 * Presenta las opciones de navegación disponibles: ficha de usuario,
 * horario, calendario y tablón de anuncios.
 * ATENCIÓN: la ruta calendario no está implementada.
 * ATENCIÓN: candidato a simplificarse extrayendo las opciones a un array de configuración.
 */
@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [CommonModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent implements OnInit {

  private readonly router = inject(Router);

  /** Rol del usuario para rutas de horario y evaluaciones. */
  private readonly authService = inject(AuthService);
  private readonly teachingContext = inject(TeacherTeachingContextService);

  /** Contraseñas: solo si el profesor es tutor de su único grupo (no hay varios grupos tutor). */
  readonly showTutorCredentials = signal(false);

  ngOnInit(): void {
    if (this.authService.getUserRole() !== 'TEACHER') {
      return;
    }
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      return;
    }
    this.teachingContext.getMyTutoredGroups(teacherId).subscribe({
      next: (groups) => this.showTutorCredentials.set(groups.length === 1),
      error: () => this.showTutorCredentials.set(false),
    });
  }

  /**
   * Navega a la ruta indicada.
   * 
   * @param route - Nombre de la ruta a la que navegar
   */
  goToComponent(route: string) {
    if (route === 'ficha-usuario') {
      const userRole = this.authService.getUserRole();
      const targetRoute = userRole === 'TEACHER' ? '/ficha-usuario-profesor' : '/ficha-usuario';
      this.router.navigate([targetRoute]);
    } else if (route === 'horario') {
      const userRole = this.authService.getUserRole();
      const targetRoute = userRole === 'TEACHER' ? '/horario-profesor' : '/horario-alumno';
      this.router.navigate([targetRoute]);
    } else if (route === 'tablon-anuncio') {
      this.router.navigate(['/issues']);
    } else if (route === 'evaluaciones') {
      const userRole = this.authService.getUserRole();
      const targetRoute = userRole === 'STUDENT' ? '/mis-evaluaciones' : '/evaluaciones';
      this.router.navigate([targetRoute]);
    } else if (route === 'credenciales-alumnos') {
      this.router.navigate(['/credenciales-alumnos']);
    } else {
      this.router.navigate([`/${route}`]);
    }
  }
}