import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaasistenciaComponent } from './tarjetaasistencia.component';

describe('TarjetaasistenciaComponent', () => {
  let component: TarjetaasistenciaComponent;
  let fixture: ComponentFixture<TarjetaasistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaasistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaasistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
