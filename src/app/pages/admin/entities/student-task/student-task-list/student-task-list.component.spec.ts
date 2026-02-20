import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskListComponent } from './student-task-list.component';

describe('StudentTaskListComponent', () => {
  let component: StudentTaskListComponent;
  let fixture: ComponentFixture<StudentTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
