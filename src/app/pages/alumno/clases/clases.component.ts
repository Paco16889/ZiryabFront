import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss']  // CORRECCIÓN: styleUrls en plural
})
export class ClasesComponent implements OnInit {
  
  private navegador = inject(NavigationService);
  private clasesService = inject(ClasesService);
  private authService = inject(AuthService); 

  // Señales principales
  public asignaturas = signal<any[]>([]);
  public loading = signal<boolean>(true);
  public errorMessage = signal<string>('');

  public profesoresMap = signal<Record<number, string>>({});

  public colorThemes = [
    { bg: 'from-blue-100 via-blue-50 to-blue-200 border-blue-200', line: 'border-blue-300', text: 'text-blue-700', btn: 'bg-blue-500 hover:bg-blue-600' },
    { bg: 'from-green-100 via-green-50 to-green-200 border-green-200', line: 'border-green-300', text: 'text-green-700', btn: 'bg-green-500 hover:bg-green-600' },
    { bg: 'from-orange-100 via-orange-50 to-orange-200 border-orange-200', line: 'border-orange-300', text: 'text-orange-700', btn: 'bg-orange-500 hover:bg-orange-600' },
    { bg: 'from-yellow-100 via-yellow-50 to-yellow-200 border-yellow-200', line: 'border-yellow-300', text: 'text-yellow-700', btn: 'bg-yellow-500 hover:bg-yellow-600' },
    { bg: 'from-pink-100 via-pink-50 to-pink-200 border-pink-200', line: 'border-pink-300', text: 'text-pink-700', btn: 'bg-pink-500 hover:bg-pink-600' },
    { bg: 'from-zinc-100 via-zinc-50 to-zinc-200 border-zinc-200', line: 'border-zinc-300', text: 'text-zinc-700', btn: 'bg-zinc-500 hover:bg-zinc-600' }
  ];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser(); 
    console.log('Alumno detectado:', user);
    
    if (user && user.id) {
      this.clasesService.getAsignaturasAlumno(user.id).subscribe({
        next: (data: any) => {
          console.log('Asignaturas recibidas (Alumno):', data);
          if (data.length === 0) {
            this.errorMessage.set('No tienes asignaturas matriculadas.');
          }
          
          this.asignaturas.set(data);
          this.loading.set(false);

          data.forEach((item: any) => {
            const subjectId = item.subject.id;
            
            // Llamamos al endpoint de detalle que SÍ tiene el profesor
            this.clasesService.getNombreProfesorParaAsignatura(subjectId).subscribe({
              next: (detail: any) => {
                // Verificamos si la respuesta tiene profesores asignados
                if (detail.teacher && detail.teacher.length > 0) {
                  // Sacamos los datos del primer profesor
                  const profeData = detail.teacher[0].teacher;
                  const nombreCompleto = `${profeData.name} ${profeData.surname}`;
                  
                  // Actualizamos el diccionario con el nuevo nombre encontrado
                  this.profesoresMap.update(mapaActual => ({
                    ...mapaActual,
                    [subjectId]: nombreCompleto
                  }));
                } else {
                   // Si no hay profesor, guardamos "Sin asignar" para que deje de salir "Buscando..."
                    this.profesoresMap.update(mapaActual => ({
                    ...mapaActual,
                    [subjectId]: 'Sin asignar'
                  }));
                }
              },
              error: (e: any) => console.warn(`No se pudo cargar info extra para asignatura ${subjectId}`)
            });
          });

        },
        error: (err: any) => {
          console.error('Error al cargar asignaturas:', err);
          this.errorMessage.set('Error de conexión con el servidor.');
          this.loading.set(false);
        }
      });
    } else {
      console.warn('No se encontró usuario logueado.');
      this.errorMessage.set('Usuario no identificado.');
      this.loading.set(false);
      this.navegador.toComponent('login');
    }
  }
  
  goToTemario(nombreAsignatura: string): void {
    if (nombreAsignatura) {
      this.navegador.toComponent(`temario/${nombreAsignatura.toLowerCase()}`); 
    }  
  }
}
