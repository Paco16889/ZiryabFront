import { Component } from '@angular/core';
import { SubjectServiceService } from '../../../../core/services/admin/subject-service.service';
import { Subject } from '../../../../core/models/subject';
import { AsignaturaListItemComponent } from '../asignatura-list-item/asignatura-list-item.component';
import { SubjectCreateFormComponent } from '../subject-create-form/subject-create-form.component';
import { BotonCreateComponent } from "../../botones/boton-create/boton-create.component";

@Component({
  selector: 'app-asignatura-list',
  imports: [AsignaturaListItemComponent, SubjectCreateFormComponent, BotonCreateComponent],
  templateUrl: './asignatura-list.component.html',
  styleUrl: './asignatura-list.component.scss'
})
export class AsignaturaListComponent {
    subjects: Subject[] = []
  
    showCreateForm = false;
    constructor(private subjectService: SubjectServiceService){}
  
    ngOnInit():void {
      this.loadSubjects();
    }

    loadSubjects(){
      this.subjectService.getSubjects().subscribe({
        next: (data) => {
          console.log('Asignaturas:' ,data);
          this.subjects = data;
        },
         error: (err) => console.error(err)
      });
    }
    

      openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onSubjectCreated() {
    this.closeCreateForm();
    this.loadSubjects();
  }
  

  onSubjectUpdated(updatedSubject: any) { // ← Añade esto
    this.loadSubjects();
  }

  onSubjectDeleted(deletedId: number) { // ← Añade esto
    this.loadSubjects();
  }
}
