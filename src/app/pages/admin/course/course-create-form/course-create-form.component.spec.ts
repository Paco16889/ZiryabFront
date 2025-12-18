import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreateFormComponent } from './course-create-form.component';

describe('CourseCreateFormComponent', () => {
  let component: CourseCreateFormComponent;
  let fixture: ComponentFixture<CourseCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
