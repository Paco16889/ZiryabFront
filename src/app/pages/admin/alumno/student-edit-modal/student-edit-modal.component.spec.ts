import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEditModalComponent } from './student-edit-modal.component';

describe('StudentEditModalComponent', () => {
  let component: StudentEditModalComponent;
  let fixture: ComponentFixture<StudentEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
