import { Component } from '@angular/core';
import { ToggleService } from '../../../core/services/toggle.service';
import { FilterSectionComponent } from '../filter-section/filter-section.component';
import { ListComponent } from '../alumno/list/list.component';
import { AsignaturaListComponent } from '../asignatura/asignatura-list/asignatura-list.component';
import { FloatMenuComponent } from '../float-menu/float-menu.component';
import { TeacherListComponent } from '../teacher/teacher-list/teacher-list.component';
import { CourseListComponent } from '../course/course-list/course-list.component';
import { GroupListComponent } from '../group/group-list/group-list.component';

@Component({
  selector: 'app-desplegable-admin',
  imports: [ListComponent, FloatMenuComponent, AsignaturaListComponent, TeacherListComponent, CourseListComponent, GroupListComponent],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

  constructor(public toggleservice: ToggleService){

  }
  //openedMenu = this.toggleservice.openedMenu();
  
  
}
