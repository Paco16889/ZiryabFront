import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CourseListItemComponent } from '../course-list-item/course-list-item.component';
import { Course } from '../../../../../core/models/course';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import {
  CourseCreateFormComponent,
  CourseCreatedPayload,
} from '../course-create-form/course-create-form.component';
import { SubjectCreateNavigationService } from '../../../../../core/services/UI/subject-create-navigation.service';
import { BotonCreateComponent } from "../../../botones/boton-create/boton-create.component";
import { TranslateModule } from '@ngx-translate/core';
import { CourseAssignmentsWizardComponent } from '../course-assignments-wizard/course-assignments-wizard.component';
import { CourseAssignmentsGridComponent } from '../course-assignments-grid/course-assignments-grid.component';
import { CourseAssignmentsContext } from '../../../../../core/models/course-assignments/course-assignments-context.model';

/**
 * Vista activa del flujo de gestión de ciclos y asignaciones docentes.
 * - `list`: listado principal
 * - `create` / `post-create`: alta de ciclo
 * - `assignments-wizard` / `assignments-grid`: asignaciones docentes
 */
type CourseListView = 'list' | 'create' | 'post-create' | 'assignments-wizard' | 'assignments-grid';

/**
 * Componente que muestra el listado de ciclos académicos del sistema.
 * Gestiona la visualización del listado, la apertura del formulario de creación
 * y la recarga automática de la lista tras operaciones de eliminación o actualización.
 */
@Component({
  selector: 'app-course-list',
  imports: [
    CourseListItemComponent,
    CourseCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
    CourseAssignmentsWizardComponent,
    CourseAssignmentsGridComponent,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  /** Navegación a alta de asignaturas con ciclo preseleccionado. */
  private readonly subjectNav = inject(SubjectCreateNavigationService);

    /**
   * Listado de ciclos académicos a mostrar, sincronizado con la signal del servicio.
   */
    courses: Course[] = [];

  /** Pantalla mostrada: listado, alta, wizard o rejilla de asignaciones. */
  readonly view = signal<CourseListView>('list');

  /** Último ciclo creado, para el paso de acciones post-alta. */
  readonly lastCreatedCourse = signal<CourseCreatedPayload | null>(null);

  /** Ciclo y grade seleccionados al abrir la rejilla de asignaciones. */
  readonly assignmentsContext = signal<CourseAssignmentsContext | null>(null);

   /**
   * @param courseService - Servicio que gestiona las operaciones con ciclos académicos
   * @param modalDeleteService - Servicio del modal de eliminación, usado para detectar
   * cuando una eliminación se completa y recargar la lista
   * @param modalUpdateService - Servicio del modal de edición, usado para detectar
   * cuando una actualización se completa y recargar la lista.
   */
      constructor(private courseService: CourseService,
        private modalDeleteService: ModalDeleteService,
        private modalUpdateService: ModalEditService)
      {
        effect(() => {
          this.courses = this.courseService.courses();
        })
        effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      const updateModalState = this.modalUpdateService.modalState();

      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.courseService.loadCourses();
      }

      if(!updateModalState.isOpen && updateModalState.showSuccess) {
        this.courseService.loadCourses();
      }
    });
      }

       /**
   * Carga el listado de ciclos académicos al inicializar el componente.
   */
      ngOnInit():void {
        this.courseService.loadCourses();
      }

  /** Muestra el formulario de alta de ciclo. */
  openCreateForm() {
    this.view.set('create');
  }

  /** Vuelve al listado sin guardar cambios en el formulario de alta. */
  closeCreateForm() {
    this.view.set('list');
  }

  /** Tras crear un ciclo, muestra acciones post-alta y recarga el listado. */
  onCourseCreated(payload: CourseCreatedPayload) {
    this.lastCreatedCourse.set(payload);
    this.view.set('post-create');
    this.courseService.loadCourses();
  }

  /** Cierra el panel post-alta y vuelve al listado. */
  closePostCreate() {
    this.lastCreatedCourse.set(null);
    this.view.set('list');
  }

  /** Navega a alta de asignaturas con el ciclo recién creado preseleccionado. */
  goToCreateSubjectsForLastCourse() {
    const created = this.lastCreatedCourse();
    if (created == null) {
      return;
    }
    this.lastCreatedCourse.set(null);
    this.view.set('list');
    this.subjectNav.goToCreateSubjectForCourse(created.id);
  }

  /** Abre el asistente ciclo → grade para asignaciones docentes. */
  openAssignmentsWizard() {
    this.assignmentsContext.set(null);
    this.view.set('assignments-wizard');
  }

  /** Cancela el wizard y vuelve al listado de ciclos. */
  onAssignmentsWizardCancel() {
    this.view.set('list');
  }

  /** Abre la rejilla de asignaciones con el contexto elegido en el wizard. */
  onAssignmentsWizardComplete(ctx: CourseAssignmentsContext) {
    this.assignmentsContext.set(ctx);
    this.view.set('assignments-grid');
  }

  /** Sale de la rejilla de asignaciones al listado principal. */
  onAssignmentsGridBack() {
    this.assignmentsContext.set(null);
    this.view.set('list');
  }
}
