import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDeleteModalComponent } from './generic-delete-modal.component';

describe('GenericDeleteModalComponent', () => {
  let component: GenericDeleteModalComponent;
  let fixture: ComponentFixture<GenericDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDeleteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
