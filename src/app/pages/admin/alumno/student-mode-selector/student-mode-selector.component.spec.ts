import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentModeSelectorComponent } from './student-mode-selector.component';

describe('StudentModeSelectorComponent', () => {
  let component: StudentModeSelectorComponent;
  let fixture: ComponentFixture<StudentModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
