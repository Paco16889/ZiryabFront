import { Component, computed, input, Input, output } from '@angular/core';

@Component({
  selector: 'app-notification-badge',
  imports: [],
  templateUrl: './notification-badge.component.html',
  styleUrl: './notification-badge.component.scss'
})
export class NotificationBadgeComponent {
     count    = input<number>(0);
  max      = input<number>(99);
  ariaLabel = input<string>('Notificaciones');

    badgeClick = output<void>();


  protected displayCount = computed(() =>
    this.count() > this.max() ? `${this.max()}+` : `${this.count()}`
  );

  protected showBadge = computed(() => this.count() > 0);
}
