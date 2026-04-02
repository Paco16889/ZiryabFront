import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/**
 * Componente que muestra las asignaturas asignadas al profesor autenticado.
 * Estructura idéntica a ClasesComponent del estudiante, candidato a unificarse.
 * ATENCIÓN: usa un endpoint desactualizado que no contempla la relación
 * ternaria profesor-asignatura-grupo-año académico del modelo actual.
 */
@Component({
  selector: 'app-clases-profesor', 
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent],
  templateUrl: './clases-profesor.component.html',
  styleUrl: './clases-profesor.component.scss'
})
export class ClasesProfesorComponent implements OnInit {
  
  
 /**
   * Servicio de navegación para gestionar las redirecciones de la aplicación.
   */
  private navegador = inject(NavigationService);

  /** Router de Angular para navegación declarativa con query params. */
  private router = inject(Router);

  /**
   * Servicio que gestiona la carga de asignaturas del profesor.
   */
  private clasesService = inject(ClasesService); 

  /**
   * Servicio de autenticación para obtener los datos del usuario actualmente autenticado.
   */
  private authService = inject(AuthService);

    /**
   * Listado de asignaturas asignadas al profesor.
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
   * Carga las asignaturas del profesor autenticado al inicializar el componente.
   * Si no hay usuario autenticado redirige al login.
   */
  ngOnInit(): void {
    const user = this.authService.getCurrentUser(); 
    console.log('Profesor detectado:', user);

    if (user && user.id) {
      this.clasesService.getAsignaturasProfesor(user.id).subscribe({
        next: (response) => {
          console.log('Asignaturas recibidas (Profe):', response);
          if (response.data.length === 0) {
            this.errorMessage.set('No tienes asignaturas asignadas.');
          }
          this.asignaturas.set(response.data);
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error('Error al cargar asignaturas:', err);
          this.errorMessage.set('Error de conexión con el servidor.');
          this.loading.set(false);
        }
      });
    } else {
      console.warn('No se encontró usuario logueado.');
      this.errorMessage.set('Usuario no identificado. Por favor, inicia sesión.');
      this.loading.set(false);
      this.navegador.toComponent('login');
    }
  }
  
    /**
   * Navega a la vista de temario de la asignatura indicada.
   * Pasa el id de la asignatura como query param para que el profesor
   * pueda cargar la lista de alumnos y registrar asistencia.
   * @param subjectId - Identificador único de la asignatura
   * @param nombreAsignatura - Nombre de la asignatura
   */
  goToTemario(subjectId: number, nombreAsignatura: string): void {
    if (nombreAsignatura) {
      this.router.navigate(
        [`temario/${nombreAsignatura.toLowerCase()}`],
        { queryParams: { subjectId } }
      );
    }
  }
}