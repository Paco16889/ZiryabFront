import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectDeleteModalComponent } from './subject-delete-modal.component';

describe('SubjectDeleteModalComponent', () => {
  let component: SubjectDeleteModalComponent;
  let fixture: ComponentFixture<SubjectDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
