import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  AppNotification,
  NotificationsService,
} from '../../../../../core/services/notifications.service';
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
  private readonly notificationsService = inject(NotificationsService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalUpdateService = inject(ModalEditService);

  notifications: AppNotification[] = [];
  showCreateForm = false;

  constructor() {
    effect(() => {
      const d = this.modalDeleteService.modalState();
      if (!d.isOpen && d.showSuccess) this.loadList();
    });
    effect(() => {
      const u = this.modalUpdateService.modalState();
      if (!u.isOpen && u.showSuccess) this.loadList();
    });
  }

  ngOnInit(): void {
    this.loadList();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  onNotificationCreated(): void {
    this.closeCreateForm();
    this.loadList();
  }

  private loadList(): void {
    this.notificationsService.getNotificationsList().subscribe((res) => {
      this.notifications = res.data ?? [];
    });
  }
}
