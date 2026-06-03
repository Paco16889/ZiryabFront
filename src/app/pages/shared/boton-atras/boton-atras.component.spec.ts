import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonAtrasComponent } from './boton-atras.component';

describe('BotonAtrasComponent', () => {
  let component: BotonAtrasComponent;
  let fixture: ComponentFixture<BotonAtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonAtrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonAtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
