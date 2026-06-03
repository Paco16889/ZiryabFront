import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../../../../core/models/task';
import { AdminTaskService } from '../../../../../core/services/admin/entities/task.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { TaskCreateFormComponent } from '../task-create-form/task-create-form.component';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';

/**
 * Listado admin de tareas. Patrón de referencia para CRUD admin (CURSO-103).
 */
@Component({
  selector: 'app-task-list',
  imports: [
    TaskListItemComponent,
    TaskCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  /** Servicio que mantiene la cache admin de tareas. */
  private readonly taskService = inject(AdminTaskService);
  /** Modal global usado para detectar borrados completados. */
  private readonly modalDeleteService = inject(ModalDeleteService);
  /** Modal global usado para detectar ediciones completadas. */
  private readonly modalUpdateService = inject(ModalEditService);

  /** Tareas renderizadas desde la signal del servicio. */
  tasks: Task[] = [];
  /** Controla si se muestra el formulario de creación. */
  showCreateForm = false;

  /** Sincroniza lista y recarga tras acciones de modales genéricos. */
  constructor() {
    effect(() => {
      this.tasks = this.taskService.tasks();
    });
    effect(() => {
      const deleteModalState = this.modalDeleteService.modalState();
      if (!deleteModalState.isOpen && deleteModalState.showSuccess) {
        this.taskService.loadTasks();
      }
    });
    effect(() => {
      const updateModalState = this.modalUpdateService.modalState();
      if (!updateModalState.isOpen && updateModalState.showSuccess) {
        this.taskService.loadTasks();
      }
    });
  }

  /** Carga inicial de tareas. */
  ngOnInit(): void {
    this.taskService.loadTasks();
  }

  /** Muestra el formulario de creación. */
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  /** Oculta el formulario de creación. */
  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga tras crear tarea. */
  onTaskCreated(): void {
    this.closeCreateForm();
    this.taskService.loadTasks();
  }
}
