import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationToggleService {
  private readonly _isOpen = signal(false);

  readonly isOpen = this._isOpen.asReadonly();

  toggle(): void {
    this._isOpen.update((v) => !v);
  }

  close(): void {
    this._isOpen.set(false);
  }
}
