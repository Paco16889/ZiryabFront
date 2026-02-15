import { Component } from '@angular/core';
import { ToggleService } from '../../../core/services/toggle.service';
import { FilterSectionComponent } from '../filter-section/filter-section.component';

import { AsignaturaListComponent } from '../entities/asignatura/asignatura-list/asignatura-list.component';

import { TeacherListComponent } from '../entities/teacher/teacher-list/teacher-list.component';
import { CourseListComponent } from '../entities/course/course-list/course-list.component';
import { GroupListComponent } from '../entities/group/group-list/group-list.component';
import { ListComponent } from '../entities/alumno/list/list.component';
import { WeekScheduleListComponent } from '../entities/weekSchedule/week-schedule-list/week-schedule-list.component';

@Component({
  selector: 'app-desplegable-admin',
  imports: [ListComponent, AsignaturaListComponent, TeacherListComponent, CourseListComponent, GroupListComponent, WeekScheduleListComponent],
  templateUrl: './desplegable-admin.component.html',
  styleUrl: './desplegable-admin.component.scss'
})
export class DesplegableAdminComponent {

  constructor(public toggleservice: ToggleService){

  }
  //openedMenu = this.toggleservice.openedMenu();
  
  
}
