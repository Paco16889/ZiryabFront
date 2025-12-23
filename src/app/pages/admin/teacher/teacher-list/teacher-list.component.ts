import { Component } from '@angular/core';
import { Teacher } from '../../../../core/models/teacher';
import { TeachersServiceService } from '../../../../core/services/admin/teachers-service.service';
import { TeacherListItemComponent } from '../teacher-list-item/teacher-list-item.component';
import { TeacherCreateFormComponent } from '../teacher-create-form/teacher-create-form.component';

@Component({
  selector: 'app-teacher-list',
  imports: [TeacherListItemComponent, TeacherCreateFormComponent],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
    teachers: Teacher[] = [];
    showCreateForm = false;
    constructor(private teacherService: TeachersServiceService){}
    
  ngOnInit() {
    this.loadTeachers();
  }
  
  loadTeachers() {
    this.teacherService.getTeachers().subscribe({
      next: (response) => {
        this.teachers = response;
      }
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
  }

  closeCreateForm() {
    this.showCreateForm = false;
  }

  onTeacherCreated() {
    this.closeCreateForm();
    this.loadTeachers();
  }

  onTeacherDeleted(deletedTeacherId: number) {
    this.loadTeachers();//revisar estee metodo
  }
}
