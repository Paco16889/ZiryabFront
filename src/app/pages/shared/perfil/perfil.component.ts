import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'})
export class PerfilComponent {
   // abrir la ventana flotante
  @Input() isOpen!: boolean;
  // se cierra cuando 
  @Output() close = new EventEmitter<void>();

  // cambiar
  userName: string = "Nombre";
  userRole: string = "Usuario Activo";
  
  constructor(private router: Router) {}

  //cerrar sesion
  onLogout(): void {
    console.log('Cerrando sesión de: ' + this.userName);
     // cierra  menu flotante
    this.close.emit();
    this.router.navigate(['/login']); 
  }
}
