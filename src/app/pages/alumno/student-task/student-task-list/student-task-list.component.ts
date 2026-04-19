import { Component, inject, OnInit } from '@angular/core';
import { StudentTaskService } from '../../../../core/services/alumno/student-task.service';
import { StudentTask } from '../../../../core/models/studentTask';
import { StudentTaskGroupComponent } from "../student-task-group/student-task-group.component";


/**
 * Componente raíz de la vista de tareas del alumno.
 * Agrupa las StudentTasks por TaskGroup y renderiza un
 * StudentTaskGroupComponent por cada grupo.
 */
@Component({
  selector: 'app-student-task-list',
  imports: [StudentTaskGroupComponent],
  templateUrl: './student-task-list.component.html',
  styleUrl: './student-task-list.component.scss'
})
export class StudentTaskListComponent implements OnInit {
    studentTaskService = inject(StudentTaskService);

  ngOnInit(): void {
    // TODO: sustituir por el idStudentEnrollment real del alumno autenticado
    this.studentTaskService.loadStudentTasksByEnrollment(1);
  }

  /**
   * Agrupa las StudentTasks por el nombre del TaskGroup de su tarea asociada.
   * Las tareas sin grupo se agrupan bajo "Sin grupo".
   */
  groupedTasks(): { groupName: string; tasks: StudentTask[] }[] {
    const map = new Map<string, StudentTask[]>();

    for (const st of this.studentTaskService.studentTasks()) {
      const groupName = st.task?.taskGroup?.name ?? 'Sin grupo';
      if (!map.has(groupName)) map.set(groupName, []);
      map.get(groupName)!.push(st);
    }

    return Array.from(map.entries()).map(([groupName, tasks]) => ({
      groupName,
      tasks,
    }));
  }
}
