import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Assistance } from '../../../../../core/models/assistance';
import { AssistanceService } from '../../../../../core/services/admin/entities/assistance.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { AssistanceCreateFormComponent } from '../assistance-create-form/assistance-create-form.component';
import { AssistanceListItemComponent } from '../assistance-list-item/assistance-list-item.component';

@Component({
  selector: 'app-assistance-list',
  imports: [
    AssistanceListItemComponent,
    AssistanceCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './assistance-list.component.html',
  styleUrl: './assistance-list.component.scss',
})
export class AssistanceListComponent implements OnInit {
  private readonly assistanceService = inject(AssistanceService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalUpdateService = inject(ModalEditService);

  assistances: Assistance[] = [];
  showCreateForm = false;

  constructor() {
    effect(() => {
      this.assistances = this.assistanceService.assistances();
    });
    effect(() => {
      const d = this.modalDeleteService.modalState();
      if (!d.isOpen && d.showSuccess) this.assistanceService.loadAssistances();
    });
    effect(() => {
      const u = this.modalUpdateService.modalState();
      if (!u.isOpen && u.showSuccess) this.assistanceService.loadAssistances();
    });
  }

  ngOnInit(): void {
    this.assistanceService.loadAssistances();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  onAssistanceCreated(): void {
    this.closeCreateForm();
    this.assistanceService.loadAssistances();
  }
}
