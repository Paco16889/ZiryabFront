import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseViewDetailComponent } from './course-view-detail.component';

describe('CourseViewDetailComponent', () => {
  let component: CourseViewDetailComponent;
  let fixture: ComponentFixture<CourseViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
