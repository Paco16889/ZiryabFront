import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCreateFormComponent } from './subject-create-form.component';

describe('SubjectCreateFormComponent', () => {
  let component: SubjectCreateFormComponent;
  let fixture: ComponentFixture<SubjectCreateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCreateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
