import { Component, effect } from '@angular/core';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';
import { Subject } from '../../../../core/models/subject';
import { AsignaturaListItemComponent } from '../asignatura-list-item/asignatura-list-item.component';
import { SubjectCreateFormComponent } from '../subject-create-form/subject-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteServiceService } from '../../../../core/services/UI/modal-delete-service.service';
import { ModalEditServiceService } from '../../../../core/services/UI/modal-edit-service.service';

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
      private modalDeleteService: ModalDeleteServiceService){
        effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
      console.log(
    '🧠 MODAL STATE:',
    'isOpen:', deleteModalState.isOpen,
    'showSuccess:', deleteModalState.showSuccess,
    'isDeleting:', deleteModalState.isDeleting
  );
      
      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.loadSubjects();
      }

      if(!updateModalState.isOpen && updateModalState.showSuccess){
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.loadSubjects();
      }
    });
    }
  
    ngOnInit():void {
      this.loadSubjects();
    }

    loadSubjects(){
      this.subjectService.getSubjects().subscribe({
        next: (data) => {
          console.log('Asignaturas:' ,data);
          this.subjects = data;
        },
         error: (err) => console.error(err)
      });
    }
    

      openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onSubjectCreated() {
    this.closeCreateForm();
    this.loadSubjects();
  }
  

  onSubjectUpdated(updatedSubject: any) { // ← Añade esto
    this.loadSubjects();
  }

  
}
