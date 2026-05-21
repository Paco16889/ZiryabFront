import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { PerfilMenuService } from '../../../core/services/perfil-menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppNotification, NotificationsService } from '../../../core/services/notifications.service';
import type { UserResponse } from '../../../core/services/auth.service';
import { SelectorIdiomaComponent } from '../selector-idioma/selector-idioma.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationBadgeComponent } from '../notification/notification-badge/notification-badge.component';
import { NotificationListComponent } from '../notification/notification-list/notification-list.component';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { NotificationToggleService } from '../../../core/services/notification/notification-toggle.service';

/**
 * Componente que representa la cabecera de la aplicación.
 *
 * Muestra el nombre y rol del usuario autenticado (claves i18n bajo `roles.*`),
 * la campana de notificaciones (badge + panel vía {@link NotificationService} /
 * {@link NotificationRepository}), toasts en tiempo real (SSE) y el menú de perfil.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    SelectorIdiomaComponent,
    TranslateModule,
    NotificationBadgeComponent,
    NotificationListComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly perfilService = inject(PerfilMenuService);
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  protected readonly notificationService = inject(NotificationService);
  protected readonly notificationPanel = inject(NotificationToggleService);

  /** Nombre del usuario autenticado a mostrar en la cabecera. */
  userName = 'Nombre';

  /** Clave de traducción del rol del usuario (p. ej. `roles.student`) mostrada en la cabecera. */
  userRoleKey = 'roles.user';

  /** Si hay sesión activa (enlace Tablón visible). */
  isAuthenticated = false;

  /** Notificación recibida por SSE para mostrar un aviso rápido (toast) en pantalla. */
  toastNotification: AppNotification | null = null;

  private readonly subs = new Subscription();

  private toastClearHandle: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.loadUserData();

    this.subs.add(
      this.authService.currentUser$.subscribe((user: UserResponse | null) => {
        if (user) {
          this.userName = user.name;
          this.userRoleKey = this.getRoleKey(user.role);
          this.isAuthenticated = true;
          this.notificationService.load();
        } else {
          this.userName = 'Nombre';
          this.userRoleKey = 'roles.user';
          this.isAuthenticated = false;
          this.dismissToast();
          this.notificationPanel.close();
        }
      })
    );

    this.subs.add(
      this.notificationsService.notification$.subscribe((notification: AppNotification) => {
        this.showToast(notification);
        this.notificationService.load();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
    }
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
      this.userRoleKey = this.getRoleKey(currentUser.role);
      this.isAuthenticated = true;
      this.notificationService.load();
    }
  }

  private getRoleKey(role: string): string {
    const map: Record<string, string> = {
      STUDENT: 'roles.student',
      TEACHER: 'roles.teacher',
      ADMIN: 'roles.admin',
    };
    return map[role] ?? 'roles.user';
  }

  toggleProfileMenu(): void {
    this.perfilService.toggleMenu();
  }

  private showToast(notification: AppNotification): void {
    this.toastNotification = notification;
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
    }
    this.toastClearHandle = setTimeout(() => {
      this.dismissToast();
    }, 6000);
  }

  dismissToast(): void {
    this.toastNotification = null;
    if (this.toastClearHandle !== null) {
      clearTimeout(this.toastClearHandle);
      this.toastClearHandle = null;
    }
  }
}
