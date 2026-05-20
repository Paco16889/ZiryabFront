import { Component, effect, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSessionListItemComponent } from '../class-session-list-item/class-session-list-item.component';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { ClassSessionCreateFormComponent } from '../class-session-create-form/class-session-create-form.component';
import { ClassSession } from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';

/**
 * Componente que muestra el listado de sesiones de clase del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-class-session-list',
  imports: [
    ClassSessionListItemComponent,
    ClassSessionCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './class-session-list.component.html',
  styleUrl: './class-session-list.component.scss',
})
export class ClassSessionListComponent implements OnInit {
  classSessions: ClassSession[] = [];
  showCreateForm = false;

  constructor(
    private classSessionService: ClassSessionService,
    private modalUpdateService: ModalEditService,
    private modalDeleteService: ModalDeleteService
  ) {
    effect(() => {
      this.classSessions = this.classSessionService.classSessions();
    });
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();

      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.classSessionService.loadSessions();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        this.classSessionService.loadSessions();
      }
    });
  }

  ngOnInit(): void {
    this.classSessionService.loadSessions();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga el listado tras crear una sesión. */
  onSessionCreated(): void {
    this.closeCreateForm();
    this.classSessionService.loadSessions();
  }
}
