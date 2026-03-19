import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra la ficha de asistencia del estudiante.
 * Actualmente contiene datos mockeados a la espera de integrarse con el backend.
 * Permite alternar entre la vista de faltas y la vista de justificación.
 * ATENCIÓN: componente pendiente de implementación real, ver issues.
 */
@Component({
  selector: 'app-ficha-usuario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './ficha-usuario.component.html',
  styleUrl: './ficha-usuario.component.scss'
})
export class FichaUsuarioComponent implements OnInit {
  
   /**
   * Vista actualmente activa: faltas o justificación.
   */
  currentView: 'faltas' | 'justificacion' = 'faltas';
  
    /**
   * Inicializa el componente.
   * @param router - Router de Angular, pendiente de usar o eliminar si no es necesario
   */
  constructor(private router: Router) {}
  
  /**
   * Pendiente de implementar la carga de datos reales de asistencia desde el backend.
   */
  ngOnInit(): void {
  }

    /**
   * Cambia la vista activa entre faltas y justificación.
   * @param view - Vista a mostrar: 'faltas' o 'justificacion'
   */
  changeView(view: 'faltas' | 'justificacion'): void {
    this.currentView = view;
  }
}