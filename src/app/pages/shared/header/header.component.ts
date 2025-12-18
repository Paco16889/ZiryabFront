import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilMenuService } from '../../../core/services/perfilService.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  userName: string = 'Nombre';
  userRole: string = 'Usuario activo';

  constructor(
    private perfilService: PerfilMenuService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();

    // Suscribirse a cambios en el usuario
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name;
        this.userRole = this.getRoleLabel(user.role);
      } else {
        this.userName = 'Nombre';
        this.userRole = 'Usuario activo';
      }
    });
  }

  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
      this.userRole = this.getRoleLabel(currentUser.role);
    }
  }

  /**
   * Convierte el rol a un texto legible
   */
  private getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'STUDENT': 'Estudiante',
      'TEACHER': 'Profesor',
      'ADMIN': 'Administrador'
    };
    return roleLabels[role] || 'Usuario activo';
  }

  /**
   * Abre/cierra el menú de perfil
   */
  toggleProfileMenu(): void {
    console.log('🔄 Toggle menú de perfil');
    this.perfilService.toggleMenu();
  }
}