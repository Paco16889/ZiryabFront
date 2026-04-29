import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, SubjectByIdResponse, SubjectsAllResponse, SubjectUpdateRequest } from '../../../../../core/models/subject';

import { SubjectServiceService } from '../../../../../core/services/admin/entities/subject-service.service';





import { CourseServiceService } from '../../../../../core/services/admin/entities/course-service.service';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';

import { GenericListItemComponent } from "../../../generic-list-item/generic-list-item.component";
import { ListItemConfig } from '../../../../../core/configs/list-item-config';
import { ViewDetailConfig } from '../../../../../core/configs/view-detail-config';

/**
 * Componente que representa un elemento del listado de asignaturas.
 * Configura los campos a mostrar, las acciones disponibles y la vista de detalle
 * para el componente genérico GenericListItemComponent.
 */
@Component({
  selector: 'app-asignatura-list-item',
  imports: [GenericListItemComponent],
  templateUrl: './asignatura-list-item.component.html',
  styleUrl: './asignatura-list-item.component.scss'
})
export class AsignaturaListItemComponent {
  /**
   * Asignatura a mostrar en el elemento de lista.
   */
   @Input() subject!: Subject;

    /**
   * Evento emitido cuando la asignatura ha sido actualizada.
   * Pendiente de sustituir el tipo inline por SubjectUpdateRequest.
   */
  @Output() subjectUpdated = new EventEmitter<SubjectUpdateRequest>();

  /**
   * Evento emitido cuando la asignatura ha sido eliminada, incluye su identificador.
   */
  @Output() subjectDeleted = new EventEmitter<number>();

    /**
   * @param subjectService - Servicio que gestiona las operaciones con asignaturas,
   * usado para las funciones getByIdFn, updateFn y deleteFn de la configuración
   * @param courseService - Servicio que proporciona los ciclos disponibles
   * para el selector del formulario de edición
   */
  constructor(
    private subjectService: SubjectServiceService,
    private courseService: CourseServiceService
  ) {}

    /**
   * Configuración del elemento de lista de la asignatura.
   * Definida como getter para garantizar que las referencias a this sean correctas
   * al acceder a los servicios dentro de la configuración.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición con el selector de ciclos asíncrono
   * y las funciones de servicio.
   */
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
        },
        {
  name: 'grade',
  label: 'Curso',
  fieldType: 'select',
  placeholder: 'Selecciona un curso',
  validators: [Validators.required],
  errorMessage: 'Debes seleccionar un curso',
  options: [
    { value: '1', label: '1º' },
    { value: '2', label: '2º' }
  ]
},
{
  name: 'hours',
  label: 'Horas semanales',
  type: 'number',
  placeholder: 'Ej: 6',
  validators: [Validators.min(1), Validators.max(30)],
  errorMessage: 'Las horas deben estar entre 1 y 30'
},
{
  name: 'description',
  label: 'Descripción',
  type: 'text',
  placeholder: 'Descripción breve de la asignatura',
  validators: [Validators.maxLength(255)],
  errorMessage: 'La descripción no puede superar los 255 caracteres'
}
      ],
      entityType: 'la asignatura',
      entityNameFormat: (subject: Subject) => subject.name,
      getByIdFn: (id: number) => this.subjectService.getSubjectbyId(id),
      updateFn: (data: any) => this.subjectService.updateSubject(data.id, data),
      deleteFn: (id: number) => this.subjectService.deleteSubject(id)
    };
  }


  /**
   * Configuración de la vista de detalle de la asignatura.
   * Define los campos nombre, curso y ciclo al que pertenece.
   */
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
          },
          {
  key: 'hours',
  type: 'text',
  format: (value) => `${value}`,
  className: 'text-xl font-bold',
  label: 'Horas semanales:'
},
{
  key: 'description',
  type: 'text',
  format: (value) => `${value}`,
  className: 'text-xl font-bold',
  label: 'Descripción:'
}
      ]
      };
      
 

 
}
