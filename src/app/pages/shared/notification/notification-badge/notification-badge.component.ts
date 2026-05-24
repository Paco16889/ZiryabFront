import { Component, computed, input, output } from '@angular/core';

/** Botón/insignia de notificaciones usado en la cabecera. */
@Component({
  selector: 'app-notification-badge',
  standalone: true,
  imports: [],
  templateUrl: './notification-badge.component.html',
  styleUrl: './notification-badge.component.scss',
})
export class NotificationBadgeComponent {
  /** Número de notificaciones no leídas recibido desde `NotificationService`. */
  count = input<number>(0);

  /** Valor máximo antes de abreviar el contador (`99+`, por defecto). */
  max = input<number>(99);

  /** Etiqueta accesible del botón para lectores de pantalla. */
  ariaLabel = input<string>('Notificaciones');

  /** Evento emitido al pulsar la insignia para abrir/cerrar el panel. */
  badgeClick = output<void>();

  /** Texto mostrado dentro de la burbuja, abreviado si supera `max`. */
  protected displayCount = computed(() =>
    this.count() > this.max() ? `${this.max()}+` : `${this.count()}`
  );

  /** Oculta la burbuja cuando no hay notificaciones pendientes. */
  protected showBadge = computed(() => this.count() > 0);
}
