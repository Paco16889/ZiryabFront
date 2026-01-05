import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, SubjectByIdResponse, SubjectsAllResponse } from '../../../../core/models/subject';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';

import { AsignaturaViewDetailComponent } from '../asignatura-view-detail/asignatura-view-detail.component';
import { SubjectEditModalComponent } from '../subject-edit-modal/subject-edit-modal.component';

import { GenericDeleteModalComponent } from "../../generic-delete-modal/generic-delete-modal.component";

@Component({
  selector: 'app-asignatura-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, AsignaturaViewDetailComponent, SubjectEditModalComponent, GenericDeleteModalComponent],
  templateUrl: './asignatura-list-item.component.html',
  styleUrl: './asignatura-list-item.component.scss'
})
export class AsignaturaListItemComponent {
   @Input() subject!:Subject;
   @Output() subjectUpdated = new EventEmitter<{id: number, name: string, idCourse: number}>();
   @Output() subjectDeleted = new EventEmitter<number>();

   selectedSubject: Subject | null = null;

     subjects: SubjectsAllResponse['data'] = [];
    selectedSubjectResponse: SubjectByIdResponse['data'] | null = null;
    subjectToEdit: SubjectByIdResponse['data'] | null = null;
    subjectToDelete: SubjectByIdResponse['data'] | null = null;
    constructor(private subjectService: SubjectServiceService){}

  toggleDetail(subjectId: number) {
     console.log('toggleDetail llamado con id:', subjectId);
    if (this.selectedSubject?.id === subjectId) {
      this.selectedSubject = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.subjectService.getSubjectbyId(subjectId).subscribe({
        
        next: data => this.selectedSubject = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedSubject?.id);
    }
  }

  toggleEdit(subjectId: number) {
    this.subjectService.getSubjectbyId(subjectId).subscribe({
      next: response => this.subjectToEdit = response,
      error: err => console.error(err)
    });
  }

  closeEditModal() {
    this.subjectToEdit = null;
  }

  onSubjectUpdated(updatedSubject: { id: number, name: string, idCourse: number }) {
    const index = this.subjects.findIndex(s => s.id === updatedSubject.id);
    if (index !== -1) {
      this.subjects[index].name = updatedSubject.name;
      this.subjects[index].idCourse = updatedSubject.idCourse;
    }
    
    if (this.selectedSubjectResponse?.id === updatedSubject.id) {
      this.selectedSubjectResponse.name = updatedSubject.name;
      this.selectedSubjectResponse.idCourse = updatedSubject.idCourse;
    }
    
    this.closeEditModal();
    this.subjectUpdated.emit(updatedSubject);
  }

  toggleDelete(subjectId: number) {
    this.subjectService.getSubjectbyId(subjectId).subscribe({
      next: response => this.subjectToDelete = response,
      error: err => console.error(err)
    });
  }

  closeDeleteModal(){
    this.subjectToDelete = null;
  }

  onSubjectDeleted(deletedSubjectId: number) {
    this.subjects = this.subjects.filter(s => s.id !== deletedSubjectId);
    
    if (this.selectedSubject?.id === deletedSubjectId) {
      this.selectedSubject = null;
    }
    
    this.closeDeleteModal();
    this.subjectDeleted.emit(deletedSubjectId);
  }

    deleteSubjectFn = (id: number) => this.subjectService.deleteSubject(id);
}
