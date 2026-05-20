import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskType } from '../../../../core/models/teacher/tasks';
import { output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

/**
 * Componente que representa una tarjeta individual de tarea.
 *
 * Muestra la banda de color del grupo en la parte superior,
 * el título, tipo, descripción, fecha de entrega y número de alumnos.
 * El color y el fondo del chip del tipo se heredan del grupo padre
 * a través de los inputs `color` y `chipBg`.
 *
 * @example
 * ```html
 * <app-task-list-item
 *   [task]="task"
 *   color="#ff6b6b"
 *   chipBg="rgba(255,107,107,0.12)"
 * />
 * ```
 */
@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './task-list-item.component.html',
})
export class TaskListItemComponent {
  private translate = inject(TranslateService);

  /** Tarea a mostrar */
  readonly task    = input.required<Task>();
  /** Color hexadecimal heredado del grupo */
  readonly color   = input.required<string>();
  /** Color de fondo semitransparente para el chip del tipo */
  readonly chipBg  = input.required<string>();

  /** Etiqueta legible del tipo de tarea */
  readonly typeLabel = computed(() => {
    const map: Record<TaskType, string> = {
      PRACTICE: 'teacherPages.taskTypes.practice',
      THEORY: 'teacherPages.taskTypes.theory',
      EXAM: 'teacherPages.taskTypes.exam',
      PROJECT: 'teacherPages.taskTypes.project',
      HOMEWORK: 'teacherPages.taskTypes.homework',
    };
    return this.translate.instant(map[this.task().type]);
  });

  /** Fecha de entrega formateada */
  readonly formattedDueDate = computed(() => {
    const date = new Date(this.task().dueDate);
    return date.toLocaleDateString('es-ES', {
      day:   '2-digit',
      month: 'short',
      hour:  '2-digit',
      minute:'2-digit',
    });
  });

  /** Número de entregas de alumnos */
  readonly studentCount = computed(() => this.task().studentTasks.length);


readonly taskClick = output<void>();

onTaskClick(): void {
  console.log('Navegando al detalle de la tarea');
  this.taskClick.emit();
}
}