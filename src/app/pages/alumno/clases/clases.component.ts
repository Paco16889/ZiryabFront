import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NavigationService } from '../../../core/services/navigation.service'; 
import { ClasesService } from '../../../core/services/clases.service';
import { LocalStorageAuthService } from '../../../core/services/localstorage-auth.service';


@Component({
  selector: 'app-clases',
  imports: [CommonModule], 
  templateUrl: './clases.component.html',
  styleUrl: './clases.component.scss'
})
export class ClasesComponent {
  private navegador = inject(NavigationService);
  private clasesService=inject(ClasesService);
  private authService=inject(LocalStorageAuthService);

  public asignatura=signal<any[]>([]);
  public loading=signal<boolean>(true);

  ngOnInit():void{
    const user=this.authService.user();
    console.log('Usuario detectado en clases: ',user)

    if(user && user.id){
      this.clasesService.getAsignaturaAlumno(user.id).subscribe({
        next:(data)=>{
          console.log('Asignaturas recibidas:', data);
          this.asignatura.set(data);
          this.loading.set(false)
        },
        error:(err)=>{
          console.error('Error al cargar asignatura: ',err);
          this.loading.set(false)
        }
      });
    }else{
      console.warn('No se encontro usuario logueado.');
      this.loading.set(false);
      this.navegador.toComponent('login');
    }
  }
  
  goToTemario(nombreAsignatura: string):void{
    this.navegador.toComponent(`temario/${nombreAsignatura.toLowerCase()}`); 
  }
}