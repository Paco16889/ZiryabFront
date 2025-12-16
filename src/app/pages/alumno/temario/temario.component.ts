import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
@Component({
  selector: 'app-temario',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './temario.component.html',
  styleUrl: './temario.component.scss'
})
export class TemarioComponent {

}
