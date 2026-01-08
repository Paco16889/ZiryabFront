import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateFormStateServiceService {

  private state = new Map<string, boolean>();

  isOpen(key: string): boolean {
    return this.state.get(key) ?? false;
  }

  open(key: string) {
    this.state.set(key, true);
  }

  close(key: string) {
    this.state.set(key, false);
  }

  toggle(key: string) {
    this.state.set(key, !this.isOpen(key));
  }
}
