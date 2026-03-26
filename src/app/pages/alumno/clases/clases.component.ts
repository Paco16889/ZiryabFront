import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra las asignaturas matriculadas del estudiante autenticado.
 * Carga las asignaturas del estudiante y el nombre del profesor de cada una
 * de forma asíncrona, mostrando cada asignatura como una tarjeta con tema de color.
 * Si no hay usuario autenticado redirige al login.
 */
@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'] 
})
export class ClasesComponent implements OnInit {
  
  private navegador = inject(NavigationService);
  private clasesService = inject(ClasesService);
  private authService = inject(AuthService); 

    /**
   * Listado de asignaturas matriculadas del estudiante.
   * 
   */
  public asignaturas = signal<any[]>([]);

    /**
   * Indica si los datos están siendo cargados desde el backend.
   */
  public loading = signal<boolean>(true);

   /**
   * Mensaje de error a mostrar si la carga de asignaturas falla.
   */
  public errorMessage = signal<string>('');

  /**
   * Mapa que relaciona el identificador de cada asignatura con el nombre de su profesor.
   * Se rellena de forma asíncrona tras cargar las asignaturas.
   */
  public profesoresMap = signal<Record<number, string>>({});

  /**
   * Temas de color para las tarjetas de asignaturas.
   * Se asignan de forma cíclica según el índice de la asignatura.
   */
  public colorThemes = [
    { 
      bg: 'from-blue-100 via-blue-50 to-blue-200 border-blue-200', 
      line: 'border-blue-300', 
      text: 'text-blue-600', 
      btn: 'bg-blue-500 hover:bg-blue-600 text-white' 
    },
    { 
      bg: 'from-purple-100 via-purple-50 to-purple-200 border-purple-200', 
      line: 'border-purple-300', 
      text: 'text-purple-600', 
      btn: 'bg-purple-500 hover:bg-purple-600 text-white' 
    },
    { 
      bg: 'from-emerald-100 via-emerald-50 to-emerald-200 border-emerald-200', 
      line: 'border-emerald-300', 
      text: 'text-emerald-600', 
      btn: 'bg-emerald-500 hover:bg-emerald-600 text-white' 
    },
    { 
      bg: 'from-rose-100 via-rose-50 to-rose-200 border-rose-200', 
      line: 'border-rose-300', 
      text: 'text-rose-600', 
      btn: 'bg-rose-500 hover:bg-rose-600 text-white' 
    },
    { 
      bg: 'from-amber-100 via-amber-50 to-amber-200 border-amber-200', 
      line: 'border-amber-300', 
      text: 'text-amber-600', 
      btn: 'bg-amber-500 hover:bg-amber-600 text-white' 
    },
    { 
      bg: 'from-cyan-100 via-cyan-50 to-cyan-200 border-cyan-200', 
      line: 'border-cyan-300', 
      text: 'text-cyan-600', 
      btn: 'bg-cyan-500 hover:bg-cyan-600 text-white' 
    }
  ];

    /**
   * Carga las asignaturas del estudiante autenticado al inicializar el componente.
   * Para cada asignatura carga también el nombre del profesor asignado.
   * Si no hay usuario autenticado redirige al login.
   */
  ngOnInit(): void {
    const user = this.authService.getCurrentUser(); 
    console.log('Alumno detectado:', user);
    
    if (user && user.id) {
      this.clasesService.getAsignaturasAlumno(user.id).subscribe({
        next: (response) => {
          console.log('Asignaturas recibidas (Alumno):', response.data);
          if (response.data.length === 0) {
            this.errorMessage.set('No tienes asignaturas matriculadas.');
          }
          
          this.asignaturas.set(response.data);
          this.loading.set(false);

          response.data.forEach((item: any) => {
            const subjectId = item.subject.id;
            
            this.clasesService.getNombreProfesorParaAsignatura(subjectId).subscribe({
              next: (detail: any) => {
                if (detail.teacher && detail.teacher.length > 0) {
                  const profeData = detail.teacher[0].teacher;
                  const nombreCompleto = `${profeData.name} ${profeData.surname}`;
                  
                  this.profesoresMap.update(mapaActual => ({
                    ...mapaActual,
                    [subjectId]: nombreCompleto
                  }));
                } else {
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
  
   /**
   * Navega a la vista de temario de la asignatura indicada.
   * ATENCIÓN: la ruta se construye con el nombre en minúsculas, puede ser frágil
   * si el nombre contiene espacios o caracteres especiales.
   * @param nombreAsignatura - Nombre de la asignatura cuyo temario se quiere ver
   */
  goToTemario(nombreAsignatura: string): void {
    if (nombreAsignatura) {
      this.navegador.toComponent(`temario/${nombreAsignatura.toLowerCase()}`); 
    }  
  }
}
