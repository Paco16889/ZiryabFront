import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskGroupComponent } from './student-task-group.component';

describe('StudentTaskGroupComponent', () => {
  let component: StudentTaskGroupComponent;
  let fixture: ComponentFixture<StudentTaskGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTaskGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTaskGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
