import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StudentTask } from '../../../../../core/models/studentTask';
import { StudentTaskService } from '../../../../../core/services/admin/entities/student-task.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { StudentTaskCreateFormComponent } from '../student-task-create-form/student-task-create-form.component';
import { StudentTaskListItemComponent } from '../student-task-list-item/student-task-list-item.component';

/** Listado administrativo de entregas de tareas con alta manual y acciones genéricas. */
@Component({
  selector: 'app-student-task-list',
  imports: [
    StudentTaskListItemComponent,
    StudentTaskCreateFormComponent,
    BotonCreateComponent,
    TranslateModule,
  ],
  templateUrl: './student-task-list.component.html',
  styleUrl: './student-task-list.component.scss',
})
export class StudentTaskListComponent implements OnInit {
  /** Servicio que mantiene la cache admin de entregas. */
  private readonly studentTaskService = inject(StudentTaskService);
  /** Modal global usado para detectar borrados completados. */
  private readonly modalDeleteService = inject(ModalDeleteService);
  /** Modal global usado para detectar ediciones completadas. */
  private readonly modalUpdateService = inject(ModalEditService);

  /** Entregas renderizadas desde la signal del servicio. */
  studentTasks: StudentTask[] = [];
  /** Controla si se muestra el formulario de creación. */
  showCreateForm = false;

  /** Sincroniza la lista y recarga tras acciones de modales. */
  constructor() {
    effect(() => {
      this.studentTasks = this.studentTaskService.studentTasks();
    });
    effect(() => {
      const d = this.modalDeleteService.modalState();
      if (!d.isOpen && d.showSuccess) this.studentTaskService.loadStudentTasks();
    });
    effect(() => {
      const u = this.modalUpdateService.modalState();
      if (!u.isOpen && u.showSuccess) this.studentTaskService.loadStudentTasks();
    });
  }

  /** Carga inicial de entregas. */
  ngOnInit(): void {
    this.studentTaskService.loadStudentTasks();
  }

  /** Muestra el formulario de creación. */
  openCreateForm(): void {
    this.showCreateForm = true;
  }

  /** Oculta el formulario de creación. */
  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  /** Cierra el formulario y recarga tras crear entrega. */
  onStudentTaskCreated(): void {
    this.closeCreateForm();
    this.studentTaskService.loadStudentTasks();
  }
}
