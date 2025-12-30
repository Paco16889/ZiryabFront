import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDeleteModalComponent } from './student-delete-modal.component';

describe('StudentDeleteModalComponent', () => {
  let component: StudentDeleteModalComponent;
  let fixture: ComponentFixture<StudentDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
