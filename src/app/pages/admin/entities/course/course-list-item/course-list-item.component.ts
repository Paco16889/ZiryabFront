import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Course, CourseDeleteResponse, CourseUpdateRequest, CourseUpdateResponse } from '../../../../../core/models/course';
import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';




import { Validators } from '@angular/forms';
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

/**
 * Componente que representa un elemento del listado de ciclos académicos.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * incluyendo la lista anidada de asignaturas del ciclo,
 * para el componente genérico GenericListItemComponent.
 */
@Component({
  selector: 'app-course-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
  /**
   * Ciclo académico a mostrar en el elemento de lista.
   */
  @Input() course!: Course;

   /**
   * Evento emitido cuando el ciclo ha sido actualizado.
   * Pendiente de sustituir el tipo inline por CourseUpdateRequest.
   */
  @Output() courseUpdated = new EventEmitter<{id: number, name: string}>();
  
  

 /**
   * Configuración del elemento de lista del ciclo académico.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición y las funciones de servicio.
   */
  courseConfig: ListItemConfig<Course, CourseUpdateRequest, CourseUpdateResponse, CourseDeleteResponse> = {
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
    updateFn: (data: CourseUpdateRequest) => this.courseService.updateCourse(data),
    deleteFn: (id: number) => this.courseService.deleteCourse(id)
  };

  /**
   * Configuración de la vista de detalle del ciclo académico.
   * Muestra el nombre del ciclo y la lista anidada de asignaturas que lo componen.
   */
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

/**
   * @param courseService - Servicio que gestiona las operaciones con ciclos académicos,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   */
  constructor(private courseService: CourseServiceService) {}

  


}


