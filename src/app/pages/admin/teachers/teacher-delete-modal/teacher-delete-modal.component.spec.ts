import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherDeleteModalComponent } from './teacher-delete-modal.component';

describe('TeacherDeleteModalComponent', () => {
  let component: TeacherDeleteModalComponent;
  let fixture: ComponentFixture<TeacherDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
