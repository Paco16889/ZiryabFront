import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ClassSession } from '../../../../../core/models/class-sessions';
import { ClassSessionService } from '../../../../../core/services/admin/entities/class-session.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { ClassSessionCreateFormComponent } from '../class-session-create-form/class-session-create-form.component';
import { ClassSessionListItemComponent } from '../class-session-list-item/class-session-list-item.component';

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
  private readonly sessionService = inject(ClassSessionService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalUpdateService = inject(ModalEditService);

  classSessions: ClassSession[] = [];
  showCreateForm = false;

  constructor() {
    effect(() => {
      this.classSessions = this.sessionService.classSessions();
    });
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.sessionService.loadSessions();
      }
    });
    effect(() => {
      const updateModalState = this.modalUpdateService.modalState();
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        this.sessionService.loadSessions();
      }
    });
  }

  ngOnInit(): void {
    this.sessionService.loadSessions();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  onSessionCreated(): void {
    this.closeCreateForm();
    this.sessionService.loadSessions();
  }
}
