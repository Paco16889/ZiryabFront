import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AppNotification } from '../../../../../core/services/notifications.service';
import { AdminNotificationService } from '../../../../../core/services/admin/entities/admin-notification.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { NotificationCreateFormComponent } from '../notification-create-form/notification-create-form.component';
import { NotificationListItemComponent } from '../notification-list-item/notification-list-item.component';

/** Listado administrativo de notificaciones con creación manual y acciones genéricas. */
@Component({
  selector: 'app-notification-list',
  imports: [
    NotificationListItemComponent,
    NotificationCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss',
})
export class NotificationListComponent implements OnInit {
  /** Servicio que mantiene la cache de notificaciones admin. */
  private readonly notificationService = inject(AdminNotificationService);

  /** Modal global usado para detectar borrados completados. */
  private readonly modalDeleteService = inject(ModalDeleteService);

  /** Modal global usado para detectar actualizaciones completadas. */
  private readonly modalUpdateService = inject(ModalEditService);

  /** Copia renderizable de la signal del servicio. */
  notifications: AppNotification[] = [];

  /** Controla si se muestra el formulario de creación manual. */
  showCreateForm = false;

  /** Sincroniza listado y recargas tras éxito en modales genéricos. */
  constructor() {
    effect(() => {
      this.notifications = this.notificationService.notifications();
    });
    effect(() => {
      const d = this.modalDeleteService.modalState();
      if (!d.isOpen && d.showSuccess) this.notificationService.loadNotifications();
    });
    effect(() => {
      const u = this.modalUpdateService.modalState();
      if (!u.isOpen && u.showSuccess) this.notificationService.loadNotifications();
    });
  }

  /** Carga el listado inicial de notificaciones. */
  ngOnInit(): void {
    this.notificationService.loadNotifications();
  }

  /** Muestra el formulario de creación manual. */
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  /** Oculta el formulario de creación manual. */
  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga tras crear una notificación. */
  onNotificationCreated(): void {
    this.closeCreateForm();
    this.notificationService.loadNotifications();
  }
}
