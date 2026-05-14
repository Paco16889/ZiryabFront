import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavigationService } from '../../../core/services/navigation.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AuthService } from '../../../core/services/auth.service';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';
import { CardGridComponent, CardItem } from '../../shared/card-grid/card-grid.component';
import { Assignment } from '../../../core/models/assingment';

interface TeacherSubjectCardSource {
  subject: { id: number; name: string; course?: { name: string } | null };
  group?: { name: string } | null;
}

/**
 * Componente que muestra las asignaturas asignadas al profesor autenticado.
 * Estructura idéntica a ClasesComponent del estudiante, candidato a unificarse.
 * ATENCIÓN: usa un endpoint desactualizado que no contempla la relación
 * ternaria profesor-asignatura-grupo-año académico del modelo actual.
 */
@Component({
  selector: 'app-clases-profesor',
  standalone: true,
  imports: [CommonModule, BotonAtrasComponent, CardGridComponent],
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
 * Listado de asignaturas asignadas al profesor mapeadas a CardItem.
 * 
 */
  public asignaturasCards = signal<CardItem[]>([]);
  private asignaturasOriginales = signal<Assignment[]>([]);

  /**
  * Indica si los datos están siendo cargados desde el backend.
  */
  public loading = signal<boolean>(true);

  /**
 * Mensaje de error a mostrar si la carga de asignaturas falla.
 */
  public errorMessage = signal<string>('');

  // Themes removidos: delegados a CardGridComponent

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
          this.asignaturasOriginales.set(response.data);
          this.construirCards();
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

  private construirCards(): void {
    const cards: CardItem[] = this.asignaturasOriginales().map(item => ({
      id: item.subject?.id || 0,
      title: item.subject?.name || 'Asignatura',
      subtitleTopLabel: 'Curso',
      subtitleTopValue: item.subject?.course?.name || 'General',
      subtitleBottomLabel: 'Grado/Grupo',
      subtitleBottomValue: item.group?.name || 'Varios',
      actionLabel: 'Gestionar Clase'
    }));
    this.asignaturasCards.set(cards);
  }

  /**
 * Navega a la vista de temario de la asignatura indicada usando el actionClicked event.
 */
  handleCardAction(item: CardItem): void {
    if (item.title) {
      this.router.navigate(
        [`temario-profesor/${item.title.toLowerCase()}`],
        { queryParams: { subjectId: item.id } }
      );
    }
  }
}
