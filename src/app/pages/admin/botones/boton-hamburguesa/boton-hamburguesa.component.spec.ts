import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonHamburguesaComponent } from './boton-hamburguesa.component';

describe('BotonHamburguesaComponent', () => {
  let component: BotonHamburguesaComponent;
  let fixture: ComponentFixture<BotonHamburguesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonHamburguesaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonHamburguesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
