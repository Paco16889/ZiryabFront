import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CourseAssignmentGridRow } from '../../../../../core/models/course-assignments/course-assignment-grid-row.model';
import { WeekScheduleNavigationService } from '../../../../../core/services/UI/week-schedule-navigation.service';
import { CourseAssignmentsGridComponent } from './course-assignments-grid.component';

describe('CourseAssignmentsGridComponent', () => {
  let component: CourseAssignmentsGridComponent;
  let fixture: ComponentFixture<CourseAssignmentsGridComponent>;
  let scheduleNav: jasmine.SpyObj<WeekScheduleNavigationService>;

  const sampleRows = (): CourseAssignmentGridRow[] => [
    { idSubject: 1, subjectName: 'Prog', idTeacher: null, idGroup: null },
    { idSubject: 2, subjectName: 'BBDD', idTeacher: null, idGroup: null },
    { idSubject: 3, subjectName: 'Entornos', idTeacher: null, idGroup: null },
  ];

  beforeEach(async () => {
    scheduleNav = jasmine.createSpyObj('WeekScheduleNavigationService', ['goToCreateTemplate']);

    await TestBed.configureTestingModule({
      imports: [CourseAssignmentsGridComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WeekScheduleNavigationService, useValue: scheduleNav },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseAssignmentsGridComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('context', {
      idCourse: 5,
      courseName: 'DAM',
      grade: '1',
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onGroupChange on first row propagates group to all rows', () => {
    component.rows.set(sampleRows());
    const first = component.rows()[0];

    component.onGroupChange(first, '42');

    expect(component.rows().every((r) => r.idGroup === 42)).toBeTrue();
  });

  it('onGroupChange on a non-first row only updates that row', () => {
    component.rows.set(sampleRows());
    const second = component.rows()[1];

    component.onGroupChange(second, '7');

    expect(component.rows()[0].idGroup).toBeNull();
    expect(component.rows()[1].idGroup).toBe(7);
    expect(component.rows()[2].idGroup).toBeNull();
  });

  it('dismissSchedulePrompt hides the post-save banner', () => {
    component.showSchedulePrompt.set(true);
    component.dismissSchedulePrompt();
    expect(component.showSchedulePrompt()).toBeFalse();
  });

  it('goToCreateSchedule navigates with saved group and context', () => {
    (component as unknown as { lastSavedGroupId: { set: (v: number) => void } }).lastSavedGroupId.set(
      99,
    );
    component.showSchedulePrompt.set(true);
    spyOn(component.back, 'emit');

    component.goToCreateSchedule();

    expect(scheduleNav.goToCreateTemplate).toHaveBeenCalledWith({
      idCourse: 5,
      grade: '1',
      idGroup: 99,
    });
    expect(component.showSchedulePrompt()).toBeFalse();
    expect(component.back.emit).toHaveBeenCalled();
  });
});
