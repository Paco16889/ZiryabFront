import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/profesor/task.service';
import { TaskGroupUiService } from '../../../../core/services/profesor/task-group-ui.service';
import { TaskGroupItemComponent } from '../task-group-item/task-group-item.component';
import { Task, TaskGroup } from '../../../../core/models/teacher/tasks';

/** Paleta de colores para asignar aleatoriamente a cada grupo */
const GROUP_PALETTE = [
  '#ff6b6b', '#748ffc', '#51cf66', '#fcc419',
  '#cc5de8', '#20c997', '#f76707', '#339af0',
];

/** Clave especial para las tareas sin grupo */
export const UNGROUPED_KEY = 'ungrouped';

/**
 * Estructura interna que agrupa tareas bajo un mismo `TaskGroup`
 * para renderizar la lista agrupada visualmente.
 */
export interface TaskGroupView {
  /** Clave única del grupo — ID como string o `'ungrouped'` */
  key: string;
  /** Nombre visible del grupo */
  name: string;
  /** Color asignado al grupo */
  color: string;
  /** Tareas que pertenecen a este grupo */
  tasks: Task[];
}

/**
 * Componente contenedor de la lista de tareas de una asignación.
 *
 * Recibe el `idTeacherAssignment` como input, carga las tareas
 * mediante `TaskService` y las agrupa por `TaskGroup` para
 * renderizar un `TaskGroupItemComponent` por cada grupo.
 *
 * @example
 * ```html
 * <app-task-list [idTeacherAssignment]="assignment.id" />
 * ```
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskGroupItemComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit, OnDestroy {

  private readonly taskService    = inject(TaskService);
  private readonly taskGroupUiSvc = inject(TaskGroupUiService);

  /** ID de la asignación del profesor cuyos tareas se cargarán */
private readonly route = inject(ActivatedRoute);

private get idTeacherAssignment(): number {
  return Number(this.route.snapshot.paramMap.get('idTeacherAssignment'));
}

  /** Signal de tareas del servicio */
  readonly tasks   = this.taskService.tasks;
  readonly loading = this.taskService.loading;

  /**
   * Computed que agrupa las tareas por TaskGroup y asigna colores.
   * Las tareas sin grupo se colocan al final bajo la clave `'ungrouped'`.
   */
  readonly groupedTasks = computed<TaskGroupView[]>(() => {
    const tasks = this.tasks();
    const colorMap = new Map<string, string>();
    let colorIndex = 0;

    const groupMap = new Map<string, TaskGroupView>();

    // Primero procesamos las tareas con grupo
    tasks.forEach((task) => {
      if (task.taskGroup) {
        const key = String(task.taskGroup.id);
        if (!groupMap.has(key)) {
          const color = GROUP_PALETTE[colorIndex % GROUP_PALETTE.length];
          colorIndex++;
          groupMap.set(key, {
            key,
            name: task.taskGroup.name,
            color,
            tasks: [],
          });
        }
        groupMap.get(key)!.tasks.push(task);
      }
    });

    // Luego las tareas sin grupo
    const ungrouped = tasks.filter((t) => !t.taskGroup);
    if (ungrouped.length > 0) {
      groupMap.set(UNGROUPED_KEY, {
        key: UNGROUPED_KEY,
        name: 'Sin agrupar',
        color: '#aaa',
        tasks: ungrouped,
      });
    }

    return Array.from(groupMap.values());
  });

  ngOnInit(): void {
   this.taskService.loadTasksByAssignment(this.idTeacherAssignment);
    // Expandir todos los grupos al cargar
    
  }

  ngOnDestroy(): void {
    this.taskService.clearTasks();
    this.taskGroupUiSvc.collapseAll();
  }
}