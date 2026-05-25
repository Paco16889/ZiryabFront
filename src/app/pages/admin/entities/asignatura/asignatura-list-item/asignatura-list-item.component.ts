import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Subject, SubjectByIdResponse, SubjectDeleteResponse, SubjectsAllResponse, SubjectUpdateRequest, SubjectUpdateResponse } from '../../../../../core/models/subject';

import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';





import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
  /** Traducciones de etiquetas y mensajes del formulario. */
  private readonly translate = inject(TranslateService);

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
    private subjectService: SubjectService,
    private courseService: CourseService,) {}

    /**
   * Configuración del elemento de lista de la asignatura.
   * Definida como getter para garantizar que las referencias a this sean correctas
   * al acceder a los servicios dentro de la configuración.
   * Define los campos visibles, las acciones disponibles, el layout,
   * los campos del formulario de edición con el selector de ciclos asíncrono
   * y las funciones de servicio.
   */
  get subjectConfig(): ListItemConfig<Subject, SubjectUpdateRequest, SubjectUpdateResponse, SubjectDeleteResponse>  {
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
          label: this.translate.instant('adminPages.forms.subject.nameLabel'),
          type: 'text',
          placeholder: this.translate.instant('adminPages.forms.subject.nameLabel'),
          validators: [Validators.required],
          errorMessage: this.translate.instant('common.validation.nameRequired')
        },
        {
          name: 'idCourse',
          label: this.translate.instant('adminPages.forms.subject.courseLabel'),
          fieldType: 'select',
          placeholder: this.translate.instant('adminPages.forms.subject.coursePlaceholder'),
          validators: [Validators.required],
          errorMessage: this.translate.instant('adminPages.forms.subject.courseRequired'),
          optionsObservable: this.courseService.getAllCourses().pipe(
            map(res => res.data)
          ),
          optionValueKey: 'id',
          optionLabelKey: 'name'
        },
        {
  name: 'grade',
  label: this.translate.instant('adminPages.forms.subject.gradeLabel'),
  fieldType: 'select',
  placeholder: this.translate.instant('adminPages.forms.subject.gradePlaceholder'),
  validators: [Validators.required],
  errorMessage: this.translate.instant('adminPages.forms.subject.gradeRequired'),
  options: [
    { value: '1', label: '1º' },
    { value: '2', label: '2º' }
  ]
},
{
  name: 'hours',
  label: this.translate.instant('adminPages.forms.subject.hoursLabel'),
  type: 'number',
  placeholder: this.translate.instant('adminPages.forms.subject.hoursPlaceholder'),
  validators: [Validators.min(1), Validators.max(30)],
  errorMessage: this.translate.instant('adminPages.forms.subject.hoursInvalid')
},
{
  name: 'description',
  label: this.translate.instant('lists.tasks.fields.description'),
  type: 'text',
  placeholder: this.translate.instant('adminPages.forms.subject.descriptionPlaceholder'),
  validators: [Validators.maxLength(255)],
  errorMessage: this.translate.instant('adminPages.forms.subject.descriptionInvalid')
}
      ],
      entityType: this.translate.instant('entities.subject.singularArticle'),
      entityNameFormat: (subject: Subject) => subject.name,
      getByIdFn: (id: number) => this.subjectService.getSubjectbyId(id),
      updateFn: (data: SubjectUpdateRequest) => this.subjectService.updateSubject(data.id, data),
      deleteFn: (id: number) => this.subjectService.deleteSubject(id)
    };
  }


  /**
   * Configuración de la vista de detalle de la asignatura.
   * Define los campos nombre, curso y ciclo al que pertenece.
   */
  get subjectDetailConfig(): ViewDetailConfig<Subject> {
    return {
      fields: [
        {
          key: 'name',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('adminPages.subjectDetail.name')
        },
        {
          key: 'grade',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('adminPages.subjectDetail.grade')
        },
        {
          key: 'course.name',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('adminPages.subjectDetail.course')
        },
        {
          key: 'hours',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('adminPages.subjectDetail.hours')
        },
        {
          key: 'description',
          type: 'text',
          format: (value) => `${value}`,
          className: 'text-xl font-bold',
          label: this.translate.instant('adminPages.subjectDetail.description')
        }
      ]
    };
  }
}
