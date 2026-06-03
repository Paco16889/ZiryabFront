import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonConfirmarStudentComponent } from './boton-confirmar-student.component';

describe('BotonConfirmarStudentComponent', () => {
  let component: BotonConfirmarStudentComponent;
  let fixture: ComponentFixture<BotonConfirmarStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonConfirmarStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonConfirmarStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
