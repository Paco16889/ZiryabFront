import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service'; 
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { CardGridComponent, CardItem } from '../../shared/card-grid/card-grid.component';
import { GetSubjectDetailResponse } from '../../../core/models/teacher/subjectforteacher';
import { StudentSubjectEnrollmentRow } from '../../../core/models/teacher/subjectforteacher';

interface StudentSubjectCardSource {
  subject: { id: number; name: string };
  group?: { name: string } | null;
}

/**
 * Componente que muestra las asignaturas matriculadas del estudiante autenticado.
 * Carga las asignaturas del estudiante y el nombre del profesor de cada una
 * de forma asíncrona, mostrando cada asignatura como una tarjeta con tema de color.
 * Si no hay usuario autenticado redirige al login.
 */
@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, CardGridComponent],
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss'] 
})
export class ClasesComponent implements OnInit {
  
  /**
   * Servicio de navegación para redirigir entre rutas de la aplicación.
   */
  private navegador = inject(NavigationService);
  /**
   * Servicio para obtener las asignaturas del estudiante y la información del profesor.
   */
  private clasesService = inject(ClasesService);
  /**
   * Servicio de autenticación para obtener los datos del usuario actual.
   */
  private authService = inject(AuthService); 

    /**
   * Listado de asignaturas matriculadas del estudiante mapeadas al formato CardItem.
   * 
   */
  public asignaturasCards = signal<CardItem[]>([]);

  // Guardamos las raw asignaturas temporalmente por si hacen falta, 
  // o podemos simplemente construir los cards.
  private asignaturasOriginales = signal<StudentSubjectEnrollmentRow[]>([]);

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

  // Temas eliminados: se trasladaron al Generic Component.

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
          
          this.asignaturasOriginales.set(response.data);
          this.construirCards();
          this.loading.set(false);

          response.data.forEach((item: StudentSubjectEnrollmentRow) => {
            const subjectId = item.subject?.id;
            if (!subjectId) return;
            
            this.clasesService.getNombreProfesorParaAsignatura(subjectId).subscribe({
              next: (responseDetail: GetSubjectDetailResponse) => {
                const subjectData = responseDetail.data;
                if (subjectData && subjectData.teacherAssignments && subjectData.teacherAssignments.length > 0) {
                  const profeData = subjectData.teacherAssignments[0].teacher;
                  if (profeData) {
                    const nombreCompleto = `${profeData.name} ${profeData.surname}`;
                    
                    this.profesoresMap.update(mapaActual => ({
                      ...mapaActual,
                      [subjectId]: nombreCompleto
                    }));
                  }
                } else {
                    this.profesoresMap.update(mapaActual => ({
                    ...mapaActual,
                    [subjectId]: 'Sin asignar'
                  }));
                }
                this.construirCards(); 
              },
              error: () => console.warn(`No se pudo cargar info extra para asignatura ${subjectId}`)
            });
          });

        },
        error: (err) => {
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
  
  private construirCards(): void {
    const cards: CardItem[] = this.asignaturasOriginales().map(item => ({
      id: item.subject?.id || 0,
      title: item.subject?.name || 'Asignatura',
      subtitleTopLabel: 'Grado/Curso',
      subtitleTopValue: item.group?.name || 'General',
      subtitleBottomLabel: 'Profesor',
      subtitleBottomValue: this.profesoresMap()[item.subject?.id || 0] || 'Consultando...',
      actionLabel: 'Acceder'
    }));
    this.asignaturasCards.set(cards);
  }

  handleCardAction(item: CardItem): void {
    if (item.title) {
      this.navegador.toComponent(`temario/${item.title.toLowerCase()}`); 
    }  
  }
}
