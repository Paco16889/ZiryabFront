import { Component } from '@angular/core';
import { ToggleService } from '../../../core/services/toggle.service';
import { FilterSectionComponent } from '../filter-section/filter-section.component';

import { AsignaturaListComponent } from '../entities/asignatura/asignatura-list/asignatura-list.component';

import { TeacherListComponent } from '../entities/teacher/teacher-list/teacher-list.component';
import { CourseListComponent } from '../entities/course/course-list/course-list.component';
import { GroupListComponent } from '../entities/group/group-list/group-list.component';
import { ListComponent } from '../entities/alumno/list/list.component';
import { WeekScheduleListComponent } from '../entities/weekSchedule/week-schedule-list/week-schedule-list.component';

/**
 * Componente que actúa como área de contenido principal del panel de administración.
 * Renderiza el componente de listado correspondiente a la sección activa
 * según el valor de la signal openedMenu del ToggleService.
 * Si no hay ninguna sección activa el área de contenido queda vacía.
 */
@Component({
  selector: 'app-desplegable-admin',
  imports: [ListComponent, AsignaturaListComponent, TeacherListComponent, CourseListComponent, GroupListComponent, WeekScheduleListComponent],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

   /**
   * Inicializa el componente.
   * @param toggleservice - Servicio que expone la sección activa del menú
   */
  constructor(public toggleservice: ToggleService){

  }
  //openedMenu = this.toggleservice.openedMenu();
  
  
}
