import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PerfilMenuService } from '../../../core/services/perfil-menu.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  AppNotification,
  NotificationsService,
} from '../../../core/services/notifications.service';
import type { UserResponse } from '../../../core/services/auth.service';
import { SelectorIdiomaComponent } from '../selector-idioma/selector-idioma.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationBadgeComponent } from '../notification/notification-badge/notification-badge.component';
import { NotificationListComponent } from '../notification/notification-list/notification-list.component';
import { NotificationToggleService } from '../../../core/services/notification/notification-toggle.service';

/**
 * Componente que representa la cabecera de la aplicación.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ThemeToggleComponent,
    SelectorIdiomaComponent,
    TranslateModule,
    NotificationBadgeComponent,
    NotificationListComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Navegación al dashboard y rutas desde la cabecera. */
  private readonly router = inject(Router);

  /** Servicio que controla el menú de perfil. */
  private readonly perfilService = inject(PerfilMenuService);
  /** Servicio de sesión para mostrar nombre/rol y reaccionar a logout. */
  private readonly authService = inject(AuthService);
  /** Notificaciones: REST, SSE y bandeja de la cabecera. */
  protected readonly notificationsService = inject(NotificationsService);
  /** Estado del panel desplegable de notificaciones. */
  protected readonly notificationPanel = inject(NotificationToggleService);

  /** Nombre mostrado en la cabecera. */
  userName = 'Nombre';
  /** Clave i18n del rol mostrado. */
  userRoleKey = 'roles.user';
  /** Toggle de tema solo visible para administradores (modo oscuro limitado al panel admin). */
  showThemeToggle = false;
  /** El título no navega en admin (usa dashboard-admin, no /dashboard). */
  isAdmin = false;
  /** Notificación mostrada temporalmente como toast. */
  toastNotification: AppNotification | null = null;

  /** Suscripciones activas de sesión y SSE. */
  private readonly subs = new Subscription();
  /** Temporizador que oculta automáticamente el toast. */
  private toastClearHandle: ReturnType<typeof setTimeout> | null = null;

  /** Sincroniza usuario, contador de notificaciones y toasts en tiempo real. */
  ngOnInit(): void {
    this.loadUserData();

    this.subs.add(
      this.authService.currentUser$.subscribe((user: UserResponse | null) => {
        if (user) {
          this.userName = user.name;
          this.userRoleKey = this.getRoleKey(user.role);
          this.showThemeToggle = user.role === 'ADMIN';
          this.isAdmin = user.role === 'ADMIN';
        } else {
          this.userName = '';
          this.userRoleKey = 'roles.user';
          this.showThemeToggle = false;
          this.isAdmin = false;
          this.dismissToast();
          this.notificationPanel.close();
        }
      })
    );

    this.subs.add(
      this.notificationsService.notification$.subscribe((notification: AppNotification) => {
        this.showToast(notification);
      })
    );
  }

  /** Cancela suscripciones y temporizador al destruir la cabecera. */
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
    }
  }

  /** Precarga usuario si la sesión ya estaba rehidratada. */
  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
      this.userRoleKey = this.getRoleKey(currentUser.role);
      this.showThemeToggle = currentUser.role === 'ADMIN';
      this.isAdmin = currentUser.role === 'ADMIN';
      this.notificationsService.load();
    }
  }

  /** Convierte el rol backend en clave de traducción. */
  private getRoleKey(role: string): string {
    const map: Record<string, string> = {
      STUDENT: 'roles.student',
      TEACHER: 'roles.teacher',
      ADMIN: 'roles.admin',
    };
    return map[role] ?? 'roles.user';
  }

  /** Navega al dashboard del usuario autenticado (alumno/profesor). */
  navigateToDashboard(): void {
    if (this.isAdmin) {
      return;
    }
    this.router.navigate(['/dashboard']);
  }

  /** Alterna menú de perfil cerrando previamente el panel de notificaciones. */
  toggleProfileMenu(): void {
    if (this.notificationPanel.isOpen()) {
      this.notificationPanel.close();
    }
    this.perfilService.toggleMenu();
  }

  /** Alterna panel de notificaciones cerrando previamente el menú de perfil. */
  toggleNotifications(): void {
    if (this.perfilService.isMenuOpen()) {
      this.perfilService.closeMenu();
    }
    this.notificationPanel.toggle();
  }

  /** Muestra un toast temporal al recibir una notificación SSE. */
  private showToast(notification: AppNotification): void {
    this.toastNotification = notification;
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
    }
    this.toastClearHandle = setTimeout(() => {
      this.dismissToast();
    }, 6000);
  }

  /** Oculta el toast actual y limpia su temporizador. */
  dismissToast(): void {
    this.toastNotification = null;
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
      this.toastClearHandle = null;
    }
  }
}
