import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonEditComponent } from '../../botones/boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../botones/boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../botones/boton-viewdetail/boton-viewdetail.component';
import { Course, CourseByIdResponse, CoursesAllResponse } from '../../../../core/models/course';
import { CourseServiceService } from '../../../../core/services/admin/course-service.service';
import { CourseViewDetailComponent } from '../course-view-detail/course-view-detail.component';


import { GenericDeleteModalComponent } from "../../modales/generic-delete-modal/generic-delete-modal.component";
import { GenericEditModalComponent } from "../../modales/generic-edit-modal/generic-edit-modal.component";
import { EditFieldConfig } from '../../../../core/models/edit-modal-config';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-course-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, CourseViewDetailComponent, GenericDeleteModalComponent, GenericEditModalComponent],
  templateUrl: './course-list-item.component.html',
  styleUrl: './course-list-item.component.scss'
})
export class CourseListItemComponent {
   @Input() course!:Course;
   @Output() courseUpdated = new EventEmitter<{id: number, name: string}>();
  @Output() courseDeleted = new EventEmitter<number>();

    selectedCourse: Course | null = null;

    courses: CoursesAllResponse['data'] = [];
    selectedCourseResponse: CourseByIdResponse['data'] | null = null;
    courseToEdit: CourseByIdResponse['data'] | null = null;
    courseToDelete: CourseByIdResponse['data'] | null = null;

    courseFields: EditFieldConfig[] = [
    { 
      name: 'name', 
      label: 'Nombre del grupo', 
      type: 'text',
      placeholder: 'Ej: Grupo A',
      validators: [Validators.required],
      errorMessage: 'El nombre es requerido'
    }
  ];
      
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

    toggleEdit(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe({
      next: response => this.courseToEdit = response,
      error: err => console.error(err)
    });
  }

  closeEditModal() {
    this.courseToEdit = null;
  }

  onCourseUpdated(updatedCourse: { id: number, name: string }) {
    // Actualiza el curso en la lista local
    const index = this.courses.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index].name = updatedCourse.name;
    }
    
    // Si estaba seleccionado, actualiza también
    if (this.selectedCourseResponse?.id === updatedCourse.id) {
      this.selectedCourseResponse.name = updatedCourse.name;
    }
    
    this.closeEditModal();
    this.courseUpdated.emit(updatedCourse);
  }

   toggleDelete(courseId: number) {
    this.courseService.getCourseById(courseId).subscribe({
      next: response => this.courseToDelete = response,
      error: err => console.error(err)
    });
  }

  closeDeleteModal(){
    this.courseToDelete = null;
  }
  onCourseDeleted(deletedCourseId: number) {
    // Elimina de la lista local
    this.courses = this.courses.filter(c => c.id !== deletedCourseId);
    
    // Si estaba seleccionado, cierra el detalle
    if (this.selectedCourse?.id === deletedCourseId) {
      this.selectedCourse = null;
    }
    
    this.closeDeleteModal();

    this.courseDeleted.emit(deletedCourseId);
  }

    deleteCourseFn = (id: number) => this.courseService.deleteCourse(id);
    updateCourseFn = (data: any) => this.courseService.updateCourse(data);
}


