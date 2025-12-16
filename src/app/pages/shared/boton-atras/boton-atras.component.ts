import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-boton-atras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-atras.component.html',
})
export class BotonAtrasComponent {
  
  private location = inject(Location);
  
  goBack(): void {
    this.location.back();
  }
}