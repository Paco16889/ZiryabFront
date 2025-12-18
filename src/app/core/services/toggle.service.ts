import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {

  openedMenu = signal<string | null>(null);
  
  toggle(menu: string){
    if (this.openedMenu() === menu) {
      this.openedMenu.set(null);
    } else{
      this.openedMenu.set(menu);
    }
    
  }
}
