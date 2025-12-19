import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCreateFormComponent } from './teacher-create-form.component';

describe('TeacherCreateFormComponent', () => {
  let component: TeacherCreateFormComponent;
  let fixture: ComponentFixture<TeacherCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
