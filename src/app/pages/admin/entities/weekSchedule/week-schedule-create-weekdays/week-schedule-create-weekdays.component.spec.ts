import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WeekScheduleCreateWeekdaysComponent } from './week-schedule-create-weekdays.component';

describe('WeekScheduleCreateWeekdaysComponent', () => {
  let component: WeekScheduleCreateWeekdaysComponent;
  let fixture: ComponentFixture<WeekScheduleCreateWeekdaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekScheduleCreateWeekdaysComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleCreateWeekdaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits sorted week days when toggling', () => {
    const emitted: number[][] = [];
    component.weekDaysChange.subscribe((days) => emitted.push(days));
    component.toggleDay(3);
    component.toggleDay(1);
    expect(emitted).toEqual([[3], [1, 3]]);
  });

  it('shows validation message when showValidation and empty selection', () => {
    fixture.componentRef.setInput('showValidation', true);
    fixture.componentRef.setInput('selectedWeekDays', []);
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert).toBeTruthy();
  });
});
