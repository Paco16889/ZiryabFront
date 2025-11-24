import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ficha-usuario',
  imports: [CommonModule],
  templateUrl: './ficha-usuario.component.html',
  styleUrl: './ficha-usuario.component.scss',
  standalone: true
})
export class FichaUsuarioComponent {
  // inicialmente mostramos las faltas.
  currentView: 'faltas' | 'justificacion' = 'faltas';
    constructor(private router: Router) {}
  
  ngOnInit(): void {
    // cargar datos iniciales aquí
  }

  /**
   * Cambia la vista activa (entre faltas y justificacion)
   * @param view La vista a mostrar ('faltas' o 'justificacion')
   */
  changeView(view: 'faltas' | 'justificacion'): void {
    this.currentView = view;
  }
}
