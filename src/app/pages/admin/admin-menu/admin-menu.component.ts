import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToggleService } from '../../../core/services/toggle.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que representa el menú lateral del panel de administración.
 * Al pulsar cada opción notifica al ToggleService qué sección debe
 * mostrarse en el área de contenido principal.
 */
@Component({
  selector: 'app-admin-menu',
  imports: [TranslateModule, RouterLink],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent {
    /**
   * Nombre de la sección del menú actualmente abierta.
   */
  openedMenu: string | null = null;

   /**
   * Evento emitido cuando el usuario hace clic en una opción del menú.
   * El componente padre lo usa para cerrar el menú móvil tras la selección.
   */
  @Output() optionClicked = new EventEmitter<void>();
  
 /**
   * Inicializa el componente.
   * @param toggle - Servicio que notifica qué sección debe mostrarse en el área de contenido principal
   */
  private readonly toggle = inject(ToggleService);

   /**
   * Alterna la sección del menú correspondiente y emite el evento de clic.
   * @param str - Nombre identificador de la sección del menú pulsada
   */
  onClick(str: string){
    this.openedMenu = str;
    this.toggle.toggle(str);
    this.optionClicked.emit();
  }

  menuButtonClass(section: string): string {
    const base = 'rounded-md border px-4 py-2 text-left transition-colors';
    const inactive = 'border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/30 dark:text-purple-200 dark:hover:bg-purple-800/40';
    const active = 'border-purple-700 bg-purple-600 text-white hover:bg-purple-700 dark:border-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600';
    return `${base} ${this.openedMenu === section ? active : inactive}`;
  }

}
