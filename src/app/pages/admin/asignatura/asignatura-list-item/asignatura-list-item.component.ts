import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, SubjectByIdResponse, SubjectsAllResponse } from '../../../../core/models/subject';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';

import { AsignaturaViewDetailComponent } from '../asignatura-view-detail/asignatura-view-detail.component';


import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";

@Component({
  selector: 'app-asignatura-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, AsignaturaViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent],
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

    editFields: EditFieldConfig[] = [];
    constructor(private subjectService: SubjectServiceService, private courseService: CourseServiceService){}

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
      next: response => {
        this.subjectToEdit = response;
        
        // Configura los campos para el modal genérico
        this.editFields = [
          {
            name: 'name',
            label: 'Nombre de la asignatura',
            type: 'text',
            placeholder: 'Nombre de la asignatura',
            validators: [Validators.required],
            errorMessage: 'El nombre es requerido'
          },
          {
            name: 'idCourse',
            label: 'Ciclo',
            fieldType: 'select',
            placeholder: 'Selecciona un ciclo',
            validators: [Validators.required],
            errorMessage: 'Debes seleccionar un ciclo',
            optionsObservable: this.courseService.getAllCourses().pipe(
              map(res => res.data)
            ),
            optionValueKey: 'id',
            optionLabelKey: 'name'
          }
        ];
      },
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
    updateSubjectFn = (data: any) => this.subjectService.updateSubject(data.id, data);
}
