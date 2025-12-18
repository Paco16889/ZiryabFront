import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectEditModalComponent } from './subject-edit-modal.component';

describe('SubjectEditModalComponent', () => {
  let component: SubjectEditModalComponent;
  let fixture: ComponentFixture<SubjectEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
