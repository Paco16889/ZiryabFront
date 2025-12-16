import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-ficha-usuario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './ficha-usuario.component.html',
  styleUrl: './ficha-usuario.component.scss'
})
export class FichaUsuarioComponent implements OnInit {
  
  currentView: 'faltas' | 'justificacion' = 'faltas';
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
  }

  changeView(view: 'faltas' | 'justificacion'): void {
    this.currentView = view;
  }
}