import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Student } from '../../../../../core/models/student';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { StudentEnrollmentComponent } from './student-enrollment.component';

describe('StudentEnrollmentComponent', () => {
  let component: StudentEnrollmentComponent;
  let fixture: ComponentFixture<StudentEnrollmentComponent>;
  let selectedStudentService: SelectedStudentService;
  let subjectService: SubjectService;

  const mockStudent: Student = {
    id: 1,
    email: 'a@test.com',
    name: 'Ana',
    surname: 'López',
    ndSurname: 'García',
    birthDate: '2000-01-01',
    dni: '12345678A',
    firebaseUID: 'uid',
    role: 'STUDENT',
    createdAt: '2024-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEnrollmentComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEnrollmentComponent);
    component = fixture.componentInstance;
    selectedStudentService = TestBed.inject(SelectedStudentService);
    subjectService = TestBed.inject(SubjectService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears enrollment state on cancel (EQ-315)', () => {
    selectedStudentService.setSelectedStudent(mockStudent);
    subjectService.setSelectedSubjects([]);
    selectedStudentService.enrollmentInProgress.set(true);

    component.onCancel();

    expect(selectedStudentService.selectedStudent()).toBeNull();
    expect(selectedStudentService.pendingStudentDraft()).toBeNull();
    expect(selectedStudentService.enrollmentInProgress()).toBeFalse();
    expect(subjectService.selectedSubjects()).toEqual([]);
  });
});
