import { Component, Input } from '@angular/core';
import { Subject } from '../../../../core/models/subject';
import { BotonEditComponent } from '../../boton-edit/boton-edit.component';
import { BotonDeleteComponent } from '../../boton-delete/boton-delete.component';
import { BotonViewdetailComponent } from '../../boton-viewdetail/boton-viewdetail.component';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';

import { AsignaturaViewDetailComponent } from '../asignatura-view-detail/asignatura-view-detail.component';

@Component({
  selector: 'app-asignatura-list-item',
  imports: [BotonEditComponent, BotonDeleteComponent, BotonViewdetailComponent, AsignaturaViewDetailComponent],
  templateUrl: './asignatura-list-item.component.html',
  styleUrl: './asignatura-list-item.component.scss'
})
export class AsignaturaListItemComponent {
   @Input() subject!:Subject;

   selectedSubject: Subject | null = null;
    constructor(private subjectService: SubjectServiceService){}

  toggleDetail(subjectId: number) {
     console.log('toggleDetail llamado con id:', subjectId);
    if (this.selectedSubject?.id === subjectId) {
      this.selectedSubject = null; // cerrar detalle si ya estaba abierto
    } else {
      // Llamada al servicio para obtener el estudiante por id
      this.subjectService.getSubjectbyId(subjectId).subscribe({
        
        next: data => this.selectedSubject = data,
        error: err => console.error(err)
      });
      console.log('estoy dentro de toggleDetail en el else', this.selectedSubject?.id);
    }
  }
}
