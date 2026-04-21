import { Component, Input, Output, EventEmitter, OnInit, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que muestra el menú de perfil del usuario autenticado.
 * Permite visualizar el nombre y rol del usuario y cerrar sesión.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

   /**
   * Controla la visibilidad del menú de perfil.
   */
  @Input() isOpen!: boolean;

  /**
   * Evento emitido cuando el menú de perfil se cierra.
   */
  @Output() close = new EventEmitter<void>();

   /**
   * Nombre del usuario autenticado.
   */
  userName: string = "Nombre";

    /**
   * Etiqueta del rol del usuario autenticado.
   */

  userRole: string = "Usuario Activo";

    /**
   * Indica si el proceso de cierre de sesión está en curso.
   */
  isLoggingOut: boolean = false;

  /**
   * Inicializa el componente.
   * @param router - Router de Angular para redirigir al login tras cerrar sesión
   * @param authService - Servicio de autenticación para obtener datos del usuario y cerrar sesión
   */
  constructor(
    private router: Router,
    private authService: AuthService // SOLO AuthService
  ) {
    this.loadUserData();
  }

     /**
   * Carga los datos del usuario actual al inicializar el componente.
   */
    ngOnInit(){
      this.loadUserData();
    }

     /**
   * Recarga los datos del usuario cuando cambia el Input isOpen.
   * ATENCIÓN: el parámetro debería ser SimpleChanges en lugar de SimpleChange.
   */
    ngOnChanges(changes: SimpleChange): void{
      this.loadUserData();
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
   * Convierte el identificador de rol a su clave de traducción.
   * @param role - Identificador del rol: STUDENT, TEACHER o ADMIN
   * @returns Clave de traducción del rol
   */
  getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'STUDENT': 'roles.student',
      'TEACHER': 'roles.teacher',
      'ADMIN': 'roles.admin'
    };
    return roleLabels[role] || 'roles.user';
  }

   /**
   * Cierra la sesión del usuario y redirige al login.
   * Si el proceso falla limpia el estado local y redirige igualmente.
   */
  onLogout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    console.log('🚪 Cerrando sesión de:', this.userName);

    // Cerrar sesión usando SOLO AuthService
    this.authService.logout().subscribe({
      next: () => {
        
        console.log('✅ Sesión cerrada correctamente');
        this.close.emit();
        
        // Redirigir a login limpiando query params
        this.router.navigate(['/login'], { 
          queryParams: {}
        }).then(() => {
          console.log('✅ Redirigido a login');
          
          this.isLoggingOut = false;
        });
      },
      error: (error) => {
        console.error('❌ Error al cerrar sesión:', error);
        
        // Aunque falle, limpiar localmente
        localStorage.clear();
        this.close.emit();
        this.router.navigate(['/login'], { 
          queryParams: {}
        });
        this.isLoggingOut = false;
      
      }
    });
  }
}