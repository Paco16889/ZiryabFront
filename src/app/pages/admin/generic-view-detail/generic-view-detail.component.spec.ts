import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericViewDetailComponent } from './generic-view-detail.component';

describe('GenericViewDetailComponent', () => {
  let component: GenericViewDetailComponent;
  let fixture: ComponentFixture<GenericViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
