import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { Course, CourseByIdResponse, CoursesAllResponse } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { CourseViewDetailComponent } from '../course-view-detail/course-view-detail.component';


import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../core/models/list-item-config';
import { GenericListItemComponent } from "../../generic-list-item/generic-list-item.component";

@Component({
  selector: 'app-course-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, CourseViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent, GenericListItemComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
  @Input() course!: Course;
  @Output() courseUpdated = new EventEmitter<{id: number, name: string}>();
  @Output() courseDeleted = new EventEmitter<number>();

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

  constructor(private courseService: CourseServiceService) {}

  onCourseUpdated(updatedCourse: any) {
    this.courseUpdated.emit(updatedCourse);
  }

  onCourseDeleted(deletedId: number) {
    this.courseDeleted.emit(deletedId);
  }
}


