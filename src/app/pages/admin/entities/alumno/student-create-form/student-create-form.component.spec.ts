import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCreateFormComponent } from './student-create-form.component';

describe('StudentCreateFormComponent', () => {
  let component: StudentCreateFormComponent;
  let fixture: ComponentFixture<StudentCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
