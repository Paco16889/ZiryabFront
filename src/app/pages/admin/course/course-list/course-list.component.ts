import { Component } from '@angular/core';
import { CourseListItemComponent } from '../course-list-item/course-list-item.component';
import { Course, CourseByIdResponse } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { CourseCreateFormComponent } from '../course-create-form/course-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";

@Component({
  selector: 'app-course-list',
  imports: [CourseListItemComponent, CourseCreateFormComponent, BotonCreateComponent],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {
    courses: Course[] = []
    
  selectedCourse: CourseByIdResponse['data'] | null = null;
  courseToEdit: CourseByIdResponse['data'] | null = null;
  courseToDelete: CourseByIdResponse['data'] | null = null;
  showCreateForm = false;  
      constructor(private courseService: CourseServiceService){}
    
      ngOnInit():void {

        this.loadCourses();
        /*this.courseService.getCourses().subscribe({
          next: (data) => {
            console.log('Asignaturas:' ,data);
            this.courses = data;
          },
           error: (err) => console.error(err)
        });*/
      }
     

loadCourses() {
  this.courseService.getAllCourses().subscribe({
        next: (response) => {
        this.courses = response.data;  // Aquí sacas el array
        console.log('Total de cursos:', response.count);
        console.log('Data: ', this.courses);
        }
        });
}
  onCourseUpdated(updatedCourse: { id: number, name: string }) {
    this.loadCourses(); // Recarga la lista
  }

  onCourseDeleted(deletedCourseId: number) {
    this.loadCourses(); // Recarga la lista
  }

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onCourseCreated() {
    this.closeCreateForm();
    this.loadCourses(); // Recarga la lista
  }

}
