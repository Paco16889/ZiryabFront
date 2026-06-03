import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericEditModalComponent } from './generic-edit-modal.component';

describe('GenericEditModalComponent', () => {
  let component: GenericEditModalComponent;
  let fixture: ComponentFixture<GenericEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
