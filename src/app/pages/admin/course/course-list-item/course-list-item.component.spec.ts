import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseListItemComponent } from './course-list-item.component';

describe('CourseListItemComponent', () => {
  let component: CourseListItemComponent;
  let fixture: ComponentFixture<CourseListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
