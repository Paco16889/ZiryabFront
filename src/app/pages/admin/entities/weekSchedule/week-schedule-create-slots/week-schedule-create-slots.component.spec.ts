import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  WeekScheduleCreateSlotsComponent,
  WeekScheduleCreateSlotRow,
} from './week-schedule-create-slots.component';

describe('WeekScheduleCreateSlotsComponent', () => {
  let component: WeekScheduleCreateSlotsComponent;
  let fixture: ComponentFixture<WeekScheduleCreateSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekScheduleCreateSlotsComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekScheduleCreateSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('grows and shrinks slot rows when count changes', () => {
    const emitted: WeekScheduleCreateSlotRow[][] = [];
    component.slotsChange.subscribe((rows) => emitted.push(rows));
    component.onSlotCountChange('3');
    expect(emitted[0].length).toBe(3);
    component.onSlotCountChange('1');
    expect(emitted[1].length).toBe(1);
  });

  it('detects invalid time format', () => {
    expect(component.isFieldFormatInvalid('08:15')).toBeFalse();
    expect(component.isFieldFormatInvalid('8:15')).toBeTrue();
    expect(component.isFieldFormatInvalid('9:00')).toBeTrue();
    expect(component.isFieldFormatInvalid('25:00')).toBeTrue();
    expect(component.isFieldFormatInvalid('08:60')).toBeTrue();
    expect(component.isFieldFormatInvalid('')).toBeTrue();
  });

  it('detects invalid time order when format is valid', () => {
    expect(
      component.isRowTimeOrderInvalid({ startTime: '10:00', finishTime: '09:00' }),
    ).toBeTrue();
    expect(
      component.isRowTimeOrderInvalid({ startTime: '08:15', finishTime: '09:15' }),
    ).toBeFalse();
  });

  it('does not normalize single-digit hour on blur', () => {
    const emitted: WeekScheduleCreateSlotRow[][] = [];
    component.slotsChange.subscribe((rows) => emitted.push(rows));
    component.onSlotTimeBlur(0, 'startTime', '8:15');
    expect(emitted.length).toBe(0);
  });
});
