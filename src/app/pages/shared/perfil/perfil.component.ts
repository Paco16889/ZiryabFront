import { Component, Input, Output, EventEmitter, OnInit, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  @Input() isOpen!: boolean;
  @Output() close = new EventEmitter<void>();

  userName: string = "Nombre";
  userRole: string = "Usuario Activo";
  isLoggingOut: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService // SOLO AuthService
  ) {
    this.loadUserData();
  }

    
    ngOnInit(){
      this.loadUserData();
    }
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
   * Convierte el rol a un texto legible
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
   * Cierra sesión del usuario
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