import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationToggleServiceService {

  private readonly _isOpen = signal(false);

  readonly isOpen = this._isOpen.asReadonly();

  toggle(): void {
    console.log('estas dentro de la función de toggle para el badge con estado: ',this._isOpen() );
        this._isOpen.update(v => !v);
  }

}
