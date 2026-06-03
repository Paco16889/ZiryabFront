import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Assistance } from '../../../../../core/models/assistance';
import { AssistanceService } from '../../../../../core/services/admin/entities/assistance.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { AssistanceCreateFormComponent } from '../assistance-create-form/assistance-create-form.component';
import { AssistanceListItemComponent } from '../assistance-list-item/assistance-list-item.component';

/** Listado administrativo de asistencias con alta manual y acciones genéricas. */
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
  /** Servicio que mantiene la cache de asistencias. */
  private readonly assistanceService = inject(AssistanceService);
  /** Modal global usado para detectar borrados completados. */
  private readonly modalDeleteService = inject(ModalDeleteService);
  /** Modal global usado para detectar ediciones completadas. */
  private readonly modalUpdateService = inject(ModalEditService);

  /** Asistencias renderizadas desde la signal del servicio. */
  assistances: Assistance[] = [];
  /** Controla si se muestra el formulario de creación. */
  showCreateForm = false;

  /** Sincroniza la lista y recarga tras modales exitosos. */
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

  /** Carga inicial de asistencias. */
  ngOnInit(): void {
    this.assistanceService.loadAssistances();
  }

  /** Muestra el formulario de alta. */
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  /** Oculta el formulario de alta. */
  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga tras crear asistencia. */
  onAssistanceCreated(): void {
    this.closeCreateForm();
    this.assistanceService.loadAssistances();
  }
}
