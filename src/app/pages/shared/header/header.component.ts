import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PerfilMenuService } from '../../../core/services/perfil-menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { AppNotification, NotificationsService } from '../../../core/services/notifications.service';
import type { UserResponse } from '../../../core/services/auth.service';
import { SelectorIdiomaComponent } from '../selector-idioma/selector-idioma.component';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationListComponent } from '../notification/notification-list/notification-list.component';
import { NotificationToggleService } from '../../../core/services/notification/notification-toggle.service';

/**
 * Componente que representa la cabecera de la aplicación.
 *
 * Muestra el nombre y rol del usuario autenticado (claves i18n bajo `roles.*`),
 * la campana de notificaciones en tiempo real (SSE) y gestiona la apertura del menú de perfil.
 *
 * Las dependencias se inyectan con `inject()`:
 * - {@link PerfilMenuService} — estado del menú de perfil
 * - {@link AuthService} — usuario autenticado y stream de sesión
 * - {@link NotificationsService} — canal SSE, contador de no leídas y avisos (toast)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, SelectorIdiomaComponent, TranslateModule, NotificationListComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly perfilService = inject(PerfilMenuService);
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  protected readonly notificationToggleService = inject(NotificationToggleService);


  /** Nombre del usuario autenticado a mostrar en la cabecera. */
  userName = 'Nombre';

  /** Clave de traducción del rol del usuario (p. ej. `roles.student`) mostrada en la cabecera. */
  userRoleKey = 'roles.user';

  /** Número de notificaciones no leídas mostrado en el badge de la campana. */
  unreadCount = 0;

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
        } else {
          this.userName = 'Nombre';
          this.userRoleKey = 'roles.user';
          this.dismissToast();
        }
      })
    );

    this.subs.add(
      this.notificationsService.unreadCount$.subscribe((n: number) => {
        this.unreadCount = n;
      })
    );

    this.subs.add(
      this.notificationsService.notification$.subscribe((notification: AppNotification) => {
        this.showToast(notification);
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
    if (this.notificationToggleService.isOpen()) {
      this.notificationToggleService.toggle();
    }
    this.perfilService.toggleMenu();
  }

  toggleNotifications(): void {
    if (this.perfilService.isMenuOpen()) {
      this.perfilService.closeMenu();
    }
    this.notificationToggleService.toggle();
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

  unreadBadge(): string {
    if (this.unreadCount <= 0) return '';
    return this.unreadCount > 99 ? '99+' : String(this.unreadCount);
  }
}
