import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { AuthService } from '../../../core/services/auth.service';
import { TeachersService } from '../../../core/services/admin/entities/teachers.service';
import { Teacher } from '../../../core/models/teacher';
import { resolveApiError } from '../../../core/i18n/api-error.util';

/**
 * Ficha de usuario del profesor autenticado.
 * Carga los datos con GET /api/teachers/:id del usuario en sesión.
 */
@Component({
  selector: 'app-ficha-usuario-profesor',
  standalone: true,
  imports: [DatePipe, BotonAtrasComponent, TranslateModule],
  templateUrl: './ficha-usuario-profesor.component.html',
  styleUrl: './ficha-usuario-profesor.component.scss',
})
export class FichaUsuarioProfesorComponent implements OnInit {

  private readonly teachersService = inject(TeachersService);
  private readonly authService = inject(AuthService);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly teacher = signal<Teacher | null>(null);

  ngOnInit(): void {
    this.cargarProfesor();
  }

  /** Obtiene el profesor en sesión por su id. */
  cargarProfesor(): void {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      this.errorMessage.set(this.translate.instant('common.errors.userNotIdentified'));
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.teachersService.getTeacherById(teacherId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.teacher.set(res.data);
        } else {
          this.errorMessage.set(this.translate.instant('teacherPages.profile.loadError'));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar ficha de profesor', err);
        this.errorMessage.set(
          resolveApiError(this.translate, err, 'teacherPages.profile.loadError'),
        );
        this.loading.set(false);
      },
    });
  }

  /** Nombre completo para la cabecera de la ficha. */
  fullName(t: Teacher): string {
    return [t.name, t.surname, t.ndSurname].filter(Boolean).join(' ').trim();
  }
}
