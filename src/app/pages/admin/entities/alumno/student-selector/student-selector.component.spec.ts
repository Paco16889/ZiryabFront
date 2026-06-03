import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSelectorComponent } from './student-selector.component';

describe('StudentSelectorComponent', () => {
  let component: StudentSelectorComponent;
  let fixture: ComponentFixture<StudentSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
