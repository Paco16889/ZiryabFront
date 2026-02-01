import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekScheduleListItemComponent } from './week-schedule-list-item.component';

describe('WeekScheduleListItemComponent', () => {
  let component: WeekScheduleListItemComponent;
  let fixture: ComponentFixture<WeekScheduleListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekScheduleListItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekScheduleListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
