import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceListComponent } from './assistance-list.component';

describe('AssistanceListComponent', () => {
  let component: AssistanceListComponent;
  let fixture: ComponentFixture<AssistanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
