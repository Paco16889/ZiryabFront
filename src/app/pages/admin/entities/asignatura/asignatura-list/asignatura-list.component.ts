import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { Subject, SubjectDeleteResponse, SubjectUpdateRequest, SubjectUpdateResponse } from '../../../../../core/models/subject';

import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { AsignaturaListItemComponent } from '../asignatura-list-item/asignatura-list-item.component';
import { SubjectCreateFormComponent } from '../subject-create-form/subject-create-form.component';
import { SubjectCreateNavigationService } from '../../../../../core/services/UI/subject-create-navigation.service';

/**
 * Componente que muestra el listado de asignaturas del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-asignatura-list',
  imports: [AsignaturaListItemComponent, SubjectCreateFormComponent, BotonCreateComponent, TranslateModule],
  templateUrl: './asignatura-list.component.html',
  styleUrl: './asignatura-list.component.scss'
})
export class AsignaturaListComponent implements OnInit {
  /** Preselección de ciclo al abrir alta desde el listado de ciclos. */
  private readonly subjectNav = inject(SubjectCreateNavigationService);

    /**
   * Listado de asignaturas a mostrar, sincronizado con la signal del servicio.
   */
  subjects: Subject[] = []

  /**
   * Controla la visibilidad del formulario de creación de asignaturas.
   */
  showCreateForm = false;

  /** Ciclo a preseleccionar al abrir el formulario desde ciclos o wizard (CURSO-140). */
  readonly preselectedIdCourse = signal<number | null>(null);

   /**
   * @param subjectService - Servicio que gestiona las operaciones con asignaturas
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   */
  constructor(private subjectService: SubjectService,
    private modalUpdateService: ModalEditService,
    private modalDeleteService: ModalDeleteService) {

      effect(() => {this.subjects = this.subjectService.subjects()})
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();
     

      // Si el modal se cerró (después de haber estado abierto con éxito)
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        console.log('✅ Eliminado con éxito, recargando lista...');
        this.subjectService.loadSubjects();
      }

      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        console.log('✅ Actualizado con éxito, recargando lista...');
        this.subjectService.loadSubjects();
      }
    });
  }

  /**
   * Carga el listado de asignaturas al inicializar el componente.
   */
  ngOnInit(): void {
    this.subjectService.loadSubjects();
    const idCourse = this.subjectNav.takePendingIdCourse();
    if (idCourse != null) {
      this.preselectedIdCourse.set(idCourse);
      this.showCreateForm = true;
    }
  }



  /**
   * Muestra el formulario de creación de asignaturas.
   */
  openCreateForm() {
    this.preselectedIdCourse.set(null);
    this.showCreateForm = true;
  }

  /**
   * Oculta el formulario de creación de asignaturas.
   */
  closeCreateForm() {
    this.showCreateForm = false;
    this.preselectedIdCourse.set(null);
  }

   /**
   * Cierra el formulario de creación y recarga el listado de asignaturas.
   * Se llama cuando el formulario de creación notifica que se ha creado una asignatura.
   */
  onSubjectCreated() {
    this.closeCreateForm();
    this.subjectService.loadSubjects();
  }



}
