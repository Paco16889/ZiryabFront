import { Component, EventEmitter, inject, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleService } from '../../../core/services/toggle.service';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente que representa el menú lateral del panel de administración.
 * Al pulsar cada opción notifica al ToggleService qué sección debe
 * mostrarse en el área de contenido principal.
 */
@Component({
  selector: 'app-admin-menu',
  imports: [ TranslateModule],
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
  private readonly router = inject(Router);

   /**
   * Alterna la sección del menú correspondiente y emite el evento de clic.
   * @param str - Nombre identificador de la sección del menú pulsada
   */
  onClick(str: string){
    if (str === 'issues') {
      this.router.navigate(['/issues']);
      this.optionClicked.emit();
      return;
    }
    this.toggle.toggle(str);
    this.optionClicked.emit();
  }

}
