import { Component, effect } from '@angular/core';
import { ClassSessionListItemComponent } from "../class-session-list-item/class-session-list-item.component";
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { ClassSession } from '../../../../../core/models/class-sessions';
import { ClassSessionServiceService } from '../../../../../core/services/admin/entities/class-session-service.service';
import { ModalEditServiceService } from '../../../../../core/services/UI/modal-edit-service.service';
import { ModalDeleteServiceService } from '../../../../../core/services/UI/modal-delete-service.service';

@Component({
  selector: 'app-class-session-list',
  imports: [ClassSessionListItemComponent, BotonCreateComponent],
  templateUrl: './class-session-list.component.html',
  styleUrl: './class-session-list.component.scss'
})
export class ClassSessionListComponent {

  classSessions: ClassSession[] = []

  showCreateForm = false;
  constructor(private classSessionService: ClassSessionServiceService,
    private modalUpdateService: ModalEditServiceService,
    private modalDeleteService: ModalDeleteServiceService) {

      effect(() => {this.classSessions = classSessionService.classSessions()})
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
     

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.classSessionService.loadSessions();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.classSessionService.loadSessions();
      }
    });
  }

  ngOnInit(): void {
    this.classSessionService.loadSessions();
  }




  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onSubjectCreated() {
    this.closeCreateForm();
    this.classSessionService.loadSessions();
  }

}
