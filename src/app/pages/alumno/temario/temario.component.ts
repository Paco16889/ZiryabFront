<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule],
>>>>>>> feature/formulariosCrud
  templateUrl: './temario.component.html',
  styleUrls: ['./temario.component.scss']
})
export class TemarioComponent{
  

}
