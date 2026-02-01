import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, SubjectByIdResponse, SubjectsAllResponse } from '../../../../../core/models/subject';

import { SubjectServiceService } from '../../../../../core/services/admin/subject-service.service';





import { CourseServiceService } from '../../../../../core/services/admin/course-service.service';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';

import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericViewDetailComponent } from "../../../generic-view-detail/generic-view-detail.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

@Component({
  selector: 'app-asignatura-list-item',
  imports: [GenericListItemComponent, GenericViewDetailComponent],
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

  subjectDetailConfig: ViewDetailConfig<Subject> = {
        fields: [
          {
            key: 'name',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Nombre de la Asignatura:'
          },
          {
            key: 'grade',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Curso en el que se imparte: '
          },
          {
            key: 'course.name',
            type: 'text',
            format: (value) => `${value}`,
            className: 'text-xl font-bold',
            label: 'Ciclo al que pertenece:'
          }
      ]
      };
      
 

 
}
