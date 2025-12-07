import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonCloseComponent } from './boton-close.component';

describe('BotonCloseComponent', () => {
  let component: BotonCloseComponent;
  let fixture: ComponentFixture<BotonCloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCloseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
