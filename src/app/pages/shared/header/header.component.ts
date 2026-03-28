import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfilMenuService } from '../../../core/services/perfil-menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { SelectorIdiomaComponent } from "../selector-idioma/selector-idioma.component";

/**
 * Componente que representa la cabecera de la aplicación.
 * Muestra el nombre y rol del usuario autenticado y gestiona
 * la apertura del menú de perfil.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SelectorIdiomaComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  /**
   * Nombre del usuario autenticado a mostrar en la cabecera.
   */
  userName: string = 'Nombre';

 /**
   * Etiqueta del rol del usuario autenticado a mostrar en la cabecera.
   */
  userRole: string = 'Usuario activo';

   /**
   * Inicializa el componente.
   * @param perfilService - Servicio para controlar el estado del menú de perfil
   * @param authService - Servicio de autenticación para obtener datos del usuario actual
   */
  constructor(
    private perfilService: PerfilMenuService,
    private authService: AuthService
  ) {}

  /**
   * Carga los datos del usuario actual y se suscribe a cambios en el estado de autenticación.
   */
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