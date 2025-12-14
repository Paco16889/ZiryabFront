import { Component, Input } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Course } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { CourseViewDetailComponent } from '../course-view-detail/course-view-detail.component';

@Component({
  selector: 'app-course-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, CourseViewDetailComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
   @Input() course!:Course;

    selectedCourse: Course | null = null;
      
     constructor(private courseService: CourseServiceService){}

  toggleDetail(courseId: number) {
      console.log('toggleDetail llamado con id:', courseId);
    if (this.selectedCourse?.id === courseId) {
      this.selectedCourse = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.courseService.getCourseById(courseId).subscribe({
        
        next: data => this.selectedCourse = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedCourse?.id);
    }
  }
}
