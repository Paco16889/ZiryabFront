import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatricularAlumnoComponent } from './matricular-alumno.component';

describe('MatricularAlumnoComponent', () => {
  let component: MatricularAlumnoComponent;
  let fixture: ComponentFixture<MatricularAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatricularAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatricularAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
