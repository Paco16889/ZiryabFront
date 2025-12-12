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

  public colorThemes = [
    { // Azul
      bg: 'from-blue-100 via-blue-50 to-blue-200 border-blue-200',
      line: 'border-blue-300',
      text: 'text-blue-700',
      btn: 'bg-blue-500 hover:bg-blue-600'
    },
    { // Verde
      bg: 'from-green-100 via-green-50 to-green-200 border-green-200',
      line: 'border-green-300',
      text: 'text-green-700',
      btn: 'bg-green-500 hover:bg-green-600'
    },
    { // Naranja
      bg: 'from-orange-100 via-orange-50 to-orange-200 border-orange-200',
      line: 'border-orange-300',
      text: 'text-orange-700',
      btn: 'bg-orange-500 hover:bg-orange-600'
    },
    { // Amarillo
      bg: 'from-yellow-100 via-yellow-50 to-yellow-200 border-yellow-200',
      line: 'border-yellow-300',
      text: 'text-yellow-700',
      btn: 'bg-yellow-500 hover:bg-yellow-600'
    },
    { // Rosa
      bg: 'from-pink-100 via-pink-50 to-pink-200 border-pink-200',
      line: 'border-pink-300',
      text: 'text-pink-700',
      btn: 'bg-pink-500 hover:bg-pink-600'
    },
    { // Zinc/Gris
      bg: 'from-zinc-100 via-zinc-50 to-zinc-200 border-zinc-200',
      line: 'border-zinc-300',
      text: 'text-zinc-700',
      btn: 'bg-zinc-500 hover:bg-zinc-600'
    }
  ];
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