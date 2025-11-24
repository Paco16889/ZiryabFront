import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NavigationService } from '../../core/services/navigation.service'; 


@Component({
  selector: 'app-clases',
  imports: [CommonModule], 
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent {
  constructor(private navegador: NavigationService) {}
  
  goToTemario(clase: string){
    this.navegador.toComponent(`temario/${clase.toLowerCase()}`); 
  }
}