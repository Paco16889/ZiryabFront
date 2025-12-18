import { Component } from '@angular/core';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';
import { Subject } from '../../../../core/models/subject';
import { AsignaturaListItemComponent } from '../asignatura-list-item/asignatura-list-item.component';

@Component({
  selector: 'app-asignatura-list',
  imports: [AsignaturaListItemComponent],
  templateUrl: './asignatura-list.component.html',
  styleUrl: './asignatura-list.component.scss'
})
export class AsignaturaListComponent {
   subjects: Subject[] = []
  
    constructor(private subjectService: SubjectServiceService){}
  
    ngOnInit():void {
      this.subjectService.getSubjects().subscribe({
        next: (data) => {
          console.log('Asignaturas:' ,data);
          this.subjects = data;
        },
         error: (err) => console.error(err)
      });
    }
}
