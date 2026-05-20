import { Component, effect, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StudentTask } from '../../../../../core/models/studentTask';
import { StudentTaskService } from '../../../../../core/services/admin/entities/student-task.service';
import { ModalDeleteService } from '../../../../../core/services/UI/modal-delete.service';
import { ModalEditService } from '../../../../../core/services/UI/modal-edit.service';
import { BotonCreateComponent } from '../../../botones/boton-create/boton-create.component';
import { StudentTaskCreateFormComponent } from '../student-task-create-form/student-task-create-form.component';
import { StudentTaskListItemComponent } from '../student-task-list-item/student-task-list-item.component';

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
  private readonly studentTaskService = inject(StudentTaskService);
  private readonly modalDeleteService = inject(ModalDeleteService);
  private readonly modalUpdateService = inject(ModalEditService);

  studentTasks: StudentTask[] = [];
  showCreateForm = false;

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

  ngOnInit(): void {
    this.studentTaskService.loadStudentTasks();
  }

  openCreateForm(): void {
    this.showCreateForm = true;
  }

  closeCreateForm(): void {
    this.showCreateForm = false;
  }

  onStudentTaskCreated(): void {
    this.closeCreateForm();
    this.studentTaskService.loadStudentTasks();
  }
}
