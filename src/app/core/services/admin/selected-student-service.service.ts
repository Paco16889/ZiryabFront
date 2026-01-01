import { Injectable, signal } from '@angular/core';
import { Student } from '../../models/student';

@Injectable({
  providedIn: 'root'
})
export class SelectedStudentServiceService {

  constructor() { }

  selectedStudent = signal<Student | null>(null);

   setSelectedStudent(student: Student) {
    this.selectedStudent.set(student);
  }
}
