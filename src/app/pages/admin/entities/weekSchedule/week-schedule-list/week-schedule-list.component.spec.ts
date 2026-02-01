import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekScheduleListComponent } from './week-schedule-list.component';

describe('WeekScheduleListComponent', () => {
  let component: WeekScheduleListComponent;
  let fixture: ComponentFixture<WeekScheduleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekScheduleListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekScheduleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
