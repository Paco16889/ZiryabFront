import { Component, Input } from '@angular/core';
import { StudentTask } from '../../../../core/models/studentTask';
import { StudentTaskListItemComponent } from "../student-task-list-item/student-task-list-item.component";
import { TranslateModule } from '@ngx-translate/core';


/**
 * Componente que representa un grupo de tareas del alumno.
 * Recibe el nombre del grupo y la lista de StudentTasks pertenecientes a él.
 */
@Component({
  selector: 'app-student-task-group',
  imports: [StudentTaskListItemComponent, TranslateModule],
  templateUrl: './student-task-group.component.html',
  styleUrl: './student-task-group.component.scss'
})
export class StudentTaskGroupComponent {
    /** Nombre del grupo de tareas */
  @Input() groupName!: string;

  /** Lista de entregas del alumno pertenecientes a este grupo */
  @Input() studentTasks!: StudentTask[];
}
