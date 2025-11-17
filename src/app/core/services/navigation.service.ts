import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private router: Router = inject(Router);


  constructor() { }

    toComponent(componentName:string){
    
    this.router.navigate([`/${componentName}`]);
  }
}
