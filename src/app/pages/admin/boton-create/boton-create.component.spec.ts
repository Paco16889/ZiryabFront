import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonCreateComponent } from './boton-create.component';

describe('BotonCreateComponent', () => {
  let component: BotonCreateComponent;
  let fixture: ComponentFixture<BotonCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
