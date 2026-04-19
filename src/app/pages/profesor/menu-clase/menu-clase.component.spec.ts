import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuClaseComponent } from './menu-clase.component';

describe('MenuClaseComponent', () => {
  let component: MenuClaseComponent;
  let fixture: ComponentFixture<MenuClaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuClaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuClaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
