import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
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

  userName = 'Nombre';
  userRoleKey = 'roles.user';
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
          this.notificationService.load();
        } else {
          this.userName = 'Nombre';
          this.userRoleKey = 'roles.user';
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
    if (this.notificationPanel.isOpen()) {
      this.notificationPanel.close();
    }
    this.perfilService.toggleMenu();
  }

  toggleNotifications(): void {
    if (this.perfilService.isMenuOpen()) {
      this.perfilService.closeMenu();
    }
    this.notificationPanel.toggle();
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
