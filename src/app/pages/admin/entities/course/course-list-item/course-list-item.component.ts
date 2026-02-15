import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Course } from '../../../../../core/models/course';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';




import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { GenericViewDetailComponent } from "../../../generic-view-detail/generic-view-detail.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';


@Component({
  selector: 'app-course-list-item',
  imports: [ GenericListItemComponent, GenericViewDetailComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
  @Input() course!: Course;
  @Output() courseUpdated = new EventEmitter<{id: number, name: string}>();
  
  

  // Configuración del list-item para courses
  courseConfig: ListItemConfig<Course> = {
    fields: [
      { 
        key: 'name',
        className: 'font-medium',
        order: 1
      }
    ],
    actions: {
      edit: true,
      delete: true,
      detail: true
    },
    layout: {
      responsive: false // Course es más simple, no necesita grid en móvil
    },
    editFields: [
      { 
        name: 'name', 
        label: 'Nombre del ciclo', 
        type: 'text',
        placeholder: 'Ej: Desarrollo de Aplicaciones Multiplataforma',
        validators: [Validators.required],
        errorMessage: 'El nombre es requerido'
      }
    ],
    entityType: 'el ciclo',
    entityNameFormat: (course: Course) => course.name,
    getByIdFn: (id: number) => this.courseService.getCourseById(id),
    updateFn: (data: any) => this.courseService.updateCourse(data),
    deleteFn: (id: number) => this.courseService.deleteCourse(id)
  };

  courseDetailConfig: ViewDetailConfig<Course> = {
    fields: [
      {
        key: 'name',
        type: 'text',
        format: (value) => `${value}`,
        className: 'text-xl font-bold',
        label: 'Nombre del Ciclo: '
      }
    ],
    nestedLists: [{
      key: 'subjects',
      itemKey: 'name',
      title: 'Asignaturas'
    }
    
  ]
  };

  constructor(private courseService: CourseServiceService) {}

  


}


