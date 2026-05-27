import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { StudentPasswordByTutor } from '../../../core/models/student-password';
import { AuthService } from '../../../core/services/auth.service';
import { StudentPasswordService } from '../../../core/services/admin/entities/student-password.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Vista del tutor para consultar credenciales de alumnos asignados.
 */
@Component({
  selector: 'app-credenciales-alumnos',
  standalone: true,
  imports: [CommonModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './credenciales-alumnos.component.html',
})
export class CredencialesAlumnosComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly studentPasswordService = inject(StudentPasswordService);
  private readonly translate = inject(TranslateService);

  isLoading = true;
  errorMessage = '';
  credentials: StudentPasswordByTutor[] = [];
  visiblePasswords = new Set<number>();

  ngOnInit(): void {
    const tutorId = this.authService.getUserId();
    if (!tutorId) {
      this.isLoading = false;
      this.errorMessage = this.translate.instant('teacherPages.credentials.errors.userNotFound');
      return;
    }

    this.studentPasswordService.getByTutor(tutorId).subscribe({
      next: (response) => {
        this.credentials = response.success ? response.data : [];
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = this.translate.instant('teacherPages.credentials.errors.load');
        this.isLoading = false;
      },
    });
  }

  togglePassword(studentId: number): void {
    if (this.visiblePasswords.has(studentId)) {
      this.visiblePasswords.delete(studentId);
      return;
    }
    this.visiblePasswords.add(studentId);
  }

  isPasswordVisible(studentId: number): boolean {
    return this.visiblePasswords.has(studentId);
  }

  getPasswordLabel(item: StudentPasswordByTutor): string {
    return this.isPasswordVisible(item.idStudent) ? item.password : '••••••••';
  }
}
