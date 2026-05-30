import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BotonAtrasComponent } from '../../shared/boton-atras/boton-atras.component';

/** Menú de acciones de una asignación docente concreta. */
@Component({
  selector: 'app-menu-clase',
  standalone: true,
  imports: [TranslateModule, BotonAtrasComponent],
  templateUrl: './menu-clase.component.html',
})
export class MenuClaseComponent implements OnInit {

  /** Router para navegar a tareas o asistencia. */
  private readonly router = inject(Router);
  /** Ruta activa que contiene el idTeacherAssignment. */
  private readonly route = inject(ActivatedRoute);

  /** Asignación docente seleccionada desde la tarjeta de clase. */
  readonly idTeacherAssignment = signal<number>(0);

  /** Lee el id de asignación docente desde la ruta. */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idTeacherAssignment');
    if (id) {
      this.idTeacherAssignment.set(+id);
    }
  }

  /** Navega al listado de tareas de la asignación. */
  navigateToTareas(): void {
    this.router.navigate(['/tareas', this.idTeacherAssignment()]);
  }

  /** Navega al área de asistencia/ficha del profesor. */
  navigateToAsistencias(): void {
    this.router.navigate(['/ficha-profesor'], {
      queryParams: { assignmentId: this.idTeacherAssignment() },
    });
  }
}