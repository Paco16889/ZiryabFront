import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CourseAssignmentsWizardComponent } from './course-assignments-wizard.component';

describe('CourseAssignmentsWizardComponent', () => {
  let component: CourseAssignmentsWizardComponent;
  let fixture: ComponentFixture<CourseAssignmentsWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseAssignmentsWizardComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseAssignmentsWizardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('courses', [{ id: 1, name: 'DAM', description: '', duration: 2, createdAt: '', subjects: [] }]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
