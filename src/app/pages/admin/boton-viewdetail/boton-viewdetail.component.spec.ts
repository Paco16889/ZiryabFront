import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonViewdetailComponent } from './boton-viewdetail.component';

describe('BotonViewdetailComponent', () => {
  let component: BotonViewdetailComponent;
  let fixture: ComponentFixture<BotonViewdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonViewdetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonViewdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
