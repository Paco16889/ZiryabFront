import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';
import { Subject } from '../../../../../core/models/subject';
import { CourseService } from '../../../../../core/services/admin/entities/course.service';
import { GroupService } from '../../../../../core/services/admin/entities/group.service';
import { SubjectService } from '../../../../../core/services/admin/entities/subject.service';
import { StudentRegistrationService } from '../../../../../core/services/admin/student-registration.service';
import { SelectedStudentService } from '../../../../../core/services/admin/selected-student.service';
import { SetRegistrationComponent } from './set-registration.component';

describe('SetRegistrationComponent', () => {
  let component: SetRegistrationComponent;
  let fixture: ComponentFixture<SetRegistrationComponent>;
  let studentRegService: jasmine.SpyObj<StudentRegistrationService>;
  let selectedStudentService: SelectedStudentService;

  const mockSubject: Subject = {
    id: 10,
    name: 'Programación',
    hours: 4,
    grade: '1',
    idCourse: 1,
  };

  beforeEach(async () => {
    studentRegService = jasmine.createSpyObj('StudentRegistrationService', ['confirmEnrollment']);

    await TestBed.configureTestingModule({
      imports: [SetRegistrationComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: CourseService,
          useValue: {
            courses: signal([]),
            loadCourses: jasmine.createSpy('loadCourses'),
          },
        },
        {
          provide: GroupService,
          useValue: {
            groups: signal([{ id: 2, name: 'Mañana', capacity: 30 }]),
            loadGroups: jasmine.createSpy('loadGroups'),
          },
        },
        {
          provide: SubjectService,
          useValue: {
            loadSubjects: jasmine.createSpy('loadSubjects'),
            setSelectedSubjects: jasmine.createSpy('setSelectedSubjects'),
            loadByCourse: () => [mockSubject],
          },
        },
        { provide: StudentRegistrationService, useValue: studentRegService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SetRegistrationComponent);
    component = fixture.componentInstance;
    selectedStudentService = TestBed.inject(SelectedStudentService);
    selectedStudentService.setSelectedStudent({
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
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits closeForm only when confirmEnrollment succeeds (EQ-313)', () => {
    studentRegService.confirmEnrollment.and.returnValue(
      of({ success: true, message: 'ok', data: { created: 1 } }),
    );
    spyOn(component.closeForm, 'emit');
    component.selectedSubjects = [mockSubject];
    component.selectedGroupId = 2;

    component.onConfirmRegistration();

    expect(studentRegService.confirmEnrollment).toHaveBeenCalledWith(2);
    expect(component.closeForm.emit).toHaveBeenCalled();
    expect(component.saveError()).toBeNull();
    expect(component.isSaving()).toBeFalse();
    expect(selectedStudentService.enrollmentInProgress()).toBeFalse();
  });

  it('keeps wizard open and shows error when confirmEnrollment fails (EQ-313)', () => {
    studentRegService.confirmEnrollment.and.returnValue(
      throwError(() => new Error('REGISTRATION_FAILED')),
    );
    spyOn(component.closeForm, 'emit');
    component.selectedSubjects = [mockSubject];
    component.selectedGroupId = 2;

    component.onConfirmRegistration();

    expect(component.closeForm.emit).not.toHaveBeenCalled();
    expect(component.saveError()).not.toBeNull();
    expect(component.isSaving()).toBeFalse();
    expect(selectedStudentService.enrollmentInProgress()).toBeFalse();
  });
});
