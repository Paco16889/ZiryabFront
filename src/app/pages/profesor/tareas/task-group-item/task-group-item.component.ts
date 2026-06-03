import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskGroupUiService } from '../../../../core/services/profesor/task-group-ui.service';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { Task } from '../../../../core/models/teacher/tasks';

/**
 * Componente que representa un grupo de tareas en la lista.
 *
 * Muestra una cabecera colapsable con la banda de color del grupo
 * y renderiza un `TaskItemComponent` por cada tarea del grupo.
 * El estado expandido/colapsado se gestiona en `TaskGroupUiService`.
 *
 * @example
 * ```html
 * <app-task-group-item
 *   groupKey="1"
 *   groupName="Unidad 1"
 *   color="#ff6b6b"
 *   [tasks]="group.tasks"
 * />
 * ```
 */
@Component({
  selector: 'app-task-group-item',
  standalone: true,
  imports: [CommonModule, TaskListItemComponent],
  templateUrl: './task-group-item.component.html',
})
export class TaskGroupItemComponent {

  /** Estado compartido de grupos expandidos/colapsados en la lista de tareas. */
  private readonly taskGroupUiSvc = inject(TaskGroupUiService);

  /** Clave única del grupo — ID como string o `'ungrouped'` */
  readonly groupKey  = input.required<string>();
  /** Nombre visible del grupo */
  readonly groupName = input.required<string>();
  /** Color hexadecimal asignado al grupo */
  readonly color     = input.required<string>();
  /** Lista de tareas que pertenecen a este grupo */
  readonly tasks     = input.required<Task[]>();

  /** Indica si el grupo está actualmente expandido */
  readonly isExpanded = computed(() => this.taskGroupUiSvc.isExpanded(this.groupKey()));

  /** Color de fondo semitransparente derivado del color del grupo */
  readonly chipBg = computed(() => this.hexToRgba(this.color(), 0.12));

  /** Alterna el estado expandido/colapsado del grupo */
  toggle(): void {
    this.taskGroupUiSvc.toggle(this.groupKey());
  }

  /**
   * Convierte un color hexadecimal (#RRGGBB) a rgba para el fondo del chip del grupo.
   * @param hex Código de color en formato hexadecimal con `#`.
   * @param alpha Opacidad del canal alpha (0–1).
   * @returns Cadena CSS `rgba(r, g, b, alpha)`.
   */
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}