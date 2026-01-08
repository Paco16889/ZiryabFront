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
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../core/models/list-item-config';

@Component({
  selector: 'app-asignatura-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, AsignaturaViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent, GenericListItemComponent],
  templateUrl: './asignatura-list-item.component.html',
  styleUrl: './asignatura-list-item.component.scss'
})
export class AsignaturaListItemComponent {
   @Input() subject!: Subject;
  @Output() subjectUpdated = new EventEmitter<{id: number, name: string, idCourse: number}>();
  @Output() subjectDeleted = new EventEmitter<number>();

  constructor(
    private subjectService: SubjectServiceService,
    private courseService: CourseServiceService
  ) {}

  // ✅ Getter que se evalúa cada vez que se accede
  get subjectConfig(): ListItemConfig<Subject> {
    return {
      fields: [
        { 
          key: 'name',
          className: 'font-medium'
        }
      ],
      actions: {
        edit: true,
        delete: true,
        detail: true
      },
      layout: {
        responsive: false
      },
      editFields: [
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
      ],
      entityType: 'la asignatura',
      entityNameFormat: (subject: Subject) => subject.name,
      getByIdFn: (id: number) => this.subjectService.getSubjectbyId(id),
      updateFn: (data: any) => this.subjectService.updateSubject(data.id, data),
      deleteFn: (id: number) => this.subjectService.deleteSubject(id)
    };
  }

  onSubjectUpdated(updatedSubject: any) {
    this.subjectUpdated.emit(updatedSubject);
  }

  onSubjectDeleted(deletedId: number) {
    this.subjectDeleted.emit(deletedId);
  }
}
