import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, map } from 'rxjs';
import { StudentPasswordByTutor } from '../../../core/models/student-password';
import { AuthService } from '../../../core/services/auth.service';
import { StudentPasswordService } from '../../../core/services/admin/entities/student-password.service';
import { TeacherTeachingContextService } from '../../../core/services/profesor/teacher-teaching-context.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/** Vista del tutor para consultar credenciales de alumnos (propias + sustitución tutor). */
@Component({
  selector: 'app-credenciales-alumnos',
  standalone: true,
  imports: [CommonModule, TranslateModule, BotonAtrasComponent],
  templateUrl: './credenciales-alumnos.component.html',
})
export class CredencialesAlumnosComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly studentPasswordService = inject(StudentPasswordService);
  private readonly teachingContext = inject(TeacherTeachingContextService);
  private readonly translate = inject(TranslateService);

  isLoading = true;
  errorMessage = '';
  credentials: StudentPasswordByTutor[] = [];
  visiblePasswords = new Set<number>();

  ngOnInit(): void {
    const teacherId = this.authService.getUserId();
    if (!teacherId) {
      this.isLoading = false;
      this.errorMessage = this.translate.instant('teacherPages.credentials.errors.userNotFound');
      return;
    }

    this.teachingContext.ensureLoaded(teacherId).subscribe({
      next: (rows) => {
        const tutorIds = new Set<number>([teacherId]);
        for (const row of rows) {
          if (row.isSubstituting && row.isTutor && row.titularTeacherId != null) {
            tutorIds.add(row.titularTeacherId);
          }
        }
        const calls = [...tutorIds].map((id) => this.studentPasswordService.getByTutor(id));
        forkJoin(calls)
          .pipe(
            map((responses) => {
              const merged: StudentPasswordByTutor[] = [];
              const seen = new Set<number>();
              for (const res of responses) {
                if (res.success === false) {
                  continue;
                }
                for (const item of res.data ?? []) {
                  if (!seen.has(item.idStudent)) {
                    seen.add(item.idStudent);
                    merged.push(item);
                  }
                }
              }
              return merged;
            }),
          )
          .subscribe({
            next: (data) => {
              this.credentials = data;
              this.isLoading = false;
            },
            error: () => {
              this.errorMessage = this.translate.instant('teacherPages.credentials.errors.load');
              this.isLoading = false;
            },
          });
      },
      error: () => {
        this.studentPasswordService.getByTutor(teacherId).subscribe({
          next: (response) => {
            this.credentials = response.success === false ? [] : (response.data ?? []);
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = this.translate.instant('teacherPages.credentials.errors.load');
            this.isLoading = false;
          },
        });
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

  getToggleAriaLabel(item: StudentPasswordByTutor): string {
    const key = this.isPasswordVisible(item.idStudent)
      ? 'teacherPages.credentials.hidePasswordAria'
      : 'teacherPages.credentials.showPasswordAria';
    return this.translate.instant(key, { name: item.studentName });
  }
}
