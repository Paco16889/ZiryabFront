import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherViewDetailComponent } from './teacher-view-detail.component';

describe('TeacherViewDetailComponent', () => {
  let component: TeacherViewDetailComponent;
  let fixture: ComponentFixture<TeacherViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
