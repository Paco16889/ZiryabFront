import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaasistenciaComponent } from './listaasistencia.component';

describe('ListaasistenciaComponent', () => {
  let component: ListaasistenciaComponent;
  let fixture: ComponentFixture<ListaasistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaasistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaasistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
