import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceListItemComponent } from './assistance-list-item.component';

describe('AssistanceListItemComponent', () => {
  let component: AssistanceListItemComponent;
  let fixture: ComponentFixture<AssistanceListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssistanceListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssistanceListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
