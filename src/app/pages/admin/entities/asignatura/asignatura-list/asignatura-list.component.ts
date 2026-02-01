import { Component, effect } from '@angular/core';
import { SubjectServiceService } from '../../../../../core/services/admin/subject-service.service';
import { Subject } from '../../../../../core/models/subject';

import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../../core/services/UI/modal-edit-service.service';
import { AsignaturaListItemComponent } from '../asignatura-list-item/asignatura-list-item.component';
import { SubjectCreateFormComponent } from '../subject-create-form/subject-create-form.component';

@Component({
  selector: 'app-asignatura-list',
  imports: [AsignaturaListItemComponent, SubjectCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './asignatura-list.component.html',
  styleUrl: './asignatura-list.component.scss'
})
export class AsignaturaListComponent {
  subjects: Subject[] = []

  showCreateForm = false;
  constructor(private subjectService: SubjectServiceService,
    private modalUpdateService: ModalEditServiceService,
    private modalDeleteService: ModalDeleteServiceService) {

      effect(() => {this.subjects = subjectService.subjects()})
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
     

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.subjectService.loadSubjects();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.subjectService.loadSubjects();
      }
    });
  }

  ngOnInit(): void {
    this.subjectService.loadSubjects();
  }




  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onSubjectCreated() {
    this.closeCreateForm();
    this.subjectService.loadSubjects();
  }



}
