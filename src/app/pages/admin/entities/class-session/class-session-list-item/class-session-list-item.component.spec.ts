import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSessionListItemComponent } from './class-session-list-item.component';

describe('ClassSessionListItemComponent', () => {
  let component: ClassSessionListItemComponent;
  let fixture: ComponentFixture<ClassSessionListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassSessionListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassSessionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
