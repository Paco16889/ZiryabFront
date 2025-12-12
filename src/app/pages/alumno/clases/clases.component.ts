import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { NavigationService } from '../../../core/services/navigation.service'; 
import { Subject } from '../../../core/models/subject';
import { SubjectServiceService } from '../../../core/services/alumno/subject-service.service';
import { SubjectComponent } from '../subject/subject.component';


@Component({
  selector: 'app-clases',
  standalone: true,
  imports: [CommonModule, SubjectComponent], 
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.scss']  // CORRECCIÓN: styleUrls en plural
})
export class ClasesComponent implements OnInit {
  subjects: Subject[] = [];

  constructor(
    private navegador: NavigationService, 
    private subjectService: SubjectServiceService
  ) {}

  ngOnInit(): void {
    this.subjectService.getSubjects().subscribe({
      next: (data) => {
        console.log('Subjects recibidos:', data);
        this.subjects = data;
      },
      error: (err) => console.error(err)
    });
  }

  goToTemario(clase: string){
    this.navegador.toComponent(`temario/${clase.toLowerCase()}`); 
  }
}
