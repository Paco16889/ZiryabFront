import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesplegableAdminComponent } from './desplegable-admin.component';

describe('DesplegableAdminComponent', () => {
  let component: DesplegableAdminComponent;
  let fixture: ComponentFixture<DesplegableAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesplegableAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesplegableAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
