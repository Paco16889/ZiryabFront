import { Component } from '@angular/core';
import { FloatMenuService } from '../../../core/services/float-menu.service';

@Component({
  selector: 'app-float-menu',
  imports: [],
  templateUrl: './float-menu.component.html',
  styleUrl: './float-menu.component.scss'
})
export class FloatMenuComponent {
  constructor(public floatMenuservice:FloatMenuService) {}
}
