import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Estructura de datos para los elementos que se muestran en el grid de tarjetas.
 */
export interface CardItem {
  /** Identificador único del elemento */
  id: number | string;
  /** Título principal de la tarjeta */
  title: string;
  /** Etiqueta para el primer subtítulo (superior) */
  subtitleTopLabel?: string;
  /** Valor para el primer subtítulo (superior) */
  subtitleTopValue?: string;
  /** Etiqueta para el segundo subtítulo (inferior) */
  subtitleBottomLabel?: string;
  /** Valor para el segundo subtítulo (inferior) */
  subtitleBottomValue?: string;
  /** Texto del botón de acción, si aplica */
  actionLabel?: string;
  /** Texto del segundo botón (debajo del principal), si aplica */
  secondaryActionLabel?: string;
  /** ID de TeacherOnSubjectOnGroup (menu-clase, tareas, justificaciones) */
  assignmentId?: number;
  /** Clave i18n de etiqueta opcional (p. ej. sustitución). */
  badgeKey?: string;
  /** Parámetros para la etiqueta con `translate`. */
  badgeParams?: Record<string, string>;
}

/**
 * Componente genérico para mostrar un listado de elementos en formato de rejilla de tarjetas.
 * Soporta estados de carga, mensajes de error y personalización de temas de color.
 */
@Component({
  selector: 'app-card-grid',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './card-grid.component.html',
  styleUrls: []
})
export class CardGridComponent {
  /** Título de la sección o del listado */
  @Input() title: string = '';
  /** Mensaje que se muestra durante la carga de datos */
  @Input() loadingMessage: string = 'common.messages.loading';
  /** Mensaje que se muestra cuando no hay elementos en la lista */
  @Input() emptyMessage: string = 'sharedPages.cardGrid.empty';
  /** Indica si los datos están en proceso de carga */
  @Input() loading: boolean = false;
  /** Mensaje de error a mostrar si falla la obtención de datos */
  @Input() errorMessage: string = '';
  /** Listado de elementos a renderizar en las tarjetas */
  @Input() items: CardItem[] = [];

  /** Evento emitido cuando se pulsa el botón de acción de una tarjeta */
  @Output() actionClicked = new EventEmitter<CardItem>();
  /** Evento emitido cuando se pulsa el botón secundario de una tarjeta */
  @Output() secondaryActionClicked = new EventEmitter<CardItem>();

  /** 
   * Definición de temas de colores para las tarjetas (ciclo automático en la plantilla).
   * @ignore
   */
  public colorThemes = [
    { bg: 'from-blue-100 via-blue-50 to-blue-200 border-blue-200', line: 'border-blue-300', text: 'text-blue-600', btn: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { bg: 'from-purple-100 via-purple-50 to-purple-200 border-purple-200', line: 'border-purple-300', text: 'text-purple-600', btn: 'bg-purple-500 hover:bg-purple-600 text-white' },
    { bg: 'from-emerald-100 via-emerald-50 to-emerald-200 border-emerald-200', line: 'border-emerald-300', text: 'text-emerald-600', btn: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
    { bg: 'from-rose-100 via-rose-50 to-rose-200 border-rose-200', line: 'border-rose-300', text: 'text-rose-600', btn: 'bg-rose-500 hover:bg-rose-600 text-white' },
    { bg: 'from-amber-100 via-amber-50 to-amber-200 border-amber-200', line: 'border-amber-300', text: 'text-amber-600', btn: 'bg-amber-500 hover:bg-amber-600 text-white' },
    { bg: 'from-cyan-100 via-cyan-50 to-cyan-200 border-cyan-200', line: 'border-cyan-300', text: 'text-cyan-600', btn: 'bg-cyan-500 hover:bg-cyan-600 text-white' }
  ];

  /**
   * Notifica al componente padre que se ha pulsado la acción de una tarjeta.
   * @param item El objeto de tarjeta sobre el que se actuó.
   */
  onAction(item: CardItem): void {
    this.actionClicked.emit(item);
  }

  /**
   * Notifica al componente padre que se ha pulsado la acción secundaria de una tarjeta.
   * @param item Tarjeta sobre la que se ejecutó la acción secundaria.
   */
  onSecondaryAction(item: CardItem): void {
    this.secondaryActionClicked.emit(item);
  }

  /** Solo traduce cadenas con formato de clave i18n (p. ej. teacherClasses.access). */
  isTranslationKey(value: string | undefined): boolean {
    return typeof value === 'string' && value.includes('.');
  }
}
