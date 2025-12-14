import { Component, Input } from '@angular/core';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { Teacher } from '../../../../core/models/teacher';
import { TeacherViewDetailComponent } from '../teacher-view-detail/teacher-view-detail.component';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';

@Component({
  selector: 'app-teacher-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, TeacherViewDetailComponent],
  templateUrl: './teacher-list-item.component.html',  
  styleUrl: './teacher-list-item.component.scss'
})
export class TeacherListItemComponent {

  @Input() teacher!: Teacher;

  selectedTeacher: Teacher | null = null;

  constructor(private teacherService: TeachersServiceService){}
  toggleDetail(teacherId: number) {
   console.log('toggleDetail llamado con id:', teacherId);
    if (this.selectedTeacher?.id === teacherId) {
      this.selectedTeacher = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.teacherService.getTeacherById(teacherId).subscribe({
        
        next: data => this.selectedTeacher = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedTeacher?.id);
    }
  }
}
