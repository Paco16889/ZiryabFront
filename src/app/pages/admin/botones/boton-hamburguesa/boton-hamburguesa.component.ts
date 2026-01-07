import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-boton-hamburguesa',
  imports: [],
  templateUrl: './boton-hamburguesa.component.html',
  styleUrl: './boton-hamburguesa.component.scss'
})
export class BotonHamburguesaComponent {
    @Output() menuToggled = new EventEmitter<void>();

  toggleMenu() {
    this.menuToggled.emit();
  }
}
