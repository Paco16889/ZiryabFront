import { Injectable, signal } from '@angular/core';

/**
 * Servicio que gestiona el estado de expansión/colapso
 * de los task-group-item en la lista de tareas.
 *
 * Mantiene un Set con los IDs de los grupos actualmente expandidos.
 * Los grupos sin ID (tareas sin agrupar) usan la clave especial `'ungrouped'`.
 */
@Injectable({ providedIn: 'root' })
export class TaskGroupUiService {

  /** Set de IDs de grupos actualmente expandidos */
  private expandedGroups = signal<Set<string>>(new Set());

  /**
   * Indica si un grupo está expandido.
   * @param groupKey - ID del grupo como string, o `'ungrouped'` para tareas sin grupo
   */
  isExpanded(groupKey: string): boolean {
    return this.expandedGroups().has(groupKey);
  }

  /**
   * Alterna el estado expandido/colapsado de un grupo.
   * @param groupKey - ID del grupo como string, o `'ungrouped'`
   */
  toggle(groupKey: string): void {
    this.expandedGroups.update((current) => {
      const next = new Set(current);
      next.has(groupKey) ? next.delete(groupKey) : next.add(groupKey);
      return next;
    });
  }

  /**
   * Expande todos los grupos de una lista.
   * @param groupKeys - Array de claves de grupo a expandir
   */
  expandAll(groupKeys: string[]): void {
    this.expandedGroups.set(new Set(groupKeys));
  }

  /**
   * Colapsa todos los grupos.
   */
  collapseAll(): void {
    this.expandedGroups.set(new Set());
  }
}