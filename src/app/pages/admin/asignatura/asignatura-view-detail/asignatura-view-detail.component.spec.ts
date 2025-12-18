import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaturaViewDetailComponent } from './asignatura-view-detail.component';

describe('AsignaturaViewDetailComponent', () => {
  let component: AsignaturaViewDetailComponent;
  let fixture: ComponentFixture<AsignaturaViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignaturaViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaturaViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
