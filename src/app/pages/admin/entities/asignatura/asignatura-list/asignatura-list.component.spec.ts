import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaturaListComponent } from './asignatura-list.component';

describe('AsignaturaListComponent', () => {
  let component: AsignaturaListComponent;
  let fixture: ComponentFixture<AsignaturaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignaturaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaturaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
