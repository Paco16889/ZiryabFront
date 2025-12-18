import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignaturaListItemComponent } from './asignatura-list-item.component';

describe('AsignaturaListItemComponent', () => {
  let component: AsignaturaListItemComponent;
  let fixture: ComponentFixture<AsignaturaListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignaturaListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignaturaListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
