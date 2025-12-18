import { Component } from '@angular/core';
import { FloatMenuComponent } from '../float-menu/float-menu.component';
import { FloatMenuService } from '../../../core/services/float-menu.service';

@Component({
  selector: 'app-boton-create',
  imports: [],
  templateUrl: './boton-create.component.html',
  styleUrl: './boton-create.component.scss'
})
export class BotonCreateComponent {

  constructor(public floatMenu: FloatMenuService) {

  }
  onClick(){
     this.floatMenu.toggleMenu();
    console.log('clic en boton create');
  }
}
