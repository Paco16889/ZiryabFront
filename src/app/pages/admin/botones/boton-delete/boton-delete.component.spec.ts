import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonDeleteComponent } from './boton-delete.component';

describe('BotonDeleteComponent', () => {
  let component: BotonDeleteComponent;
  let fixture: ComponentFixture<BotonDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
