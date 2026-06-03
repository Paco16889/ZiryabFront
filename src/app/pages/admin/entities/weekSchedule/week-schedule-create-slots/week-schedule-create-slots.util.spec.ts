import { environment } from '../../../../../../environments/environment';
import {
  defaultWeekScheduleSlotRow,
  maxSlotRowsForTemplate,
  nextWeekScheduleSlotRow,
  weekScheduleSlotStartPlaceholder,
} from './week-schedule-create-slots.util';

describe('week-schedule-create-slots.util', () => {
  const firstSlot = environment.timetableSlots[0];

  describe('defaultWeekScheduleSlotRow', () => {
    it('uses the first center timetable slot', () => {
      expect(defaultWeekScheduleSlotRow()).toEqual({
        startTime: firstSlot.startTime,
        finishTime: firstSlot.finishTime,
      });
    });
  });

  describe('weekScheduleSlotStartPlaceholder', () => {
    it('returns center start for the first row', () => {
      expect(weekScheduleSlotStartPlaceholder([], 0)).toBe(firstSlot.startTime);
    });

    it('chains from previous row finishTime on the same day', () => {
      const slots = [{ startTime: '08:15', finishTime: '09:15' }];
      expect(weekScheduleSlotStartPlaceholder(slots, 1)).toBe('09:15');
    });

    it('falls back to center start when previous finishTime is invalid', () => {
      const slots = [{ startTime: '08:15', finishTime: '9:15' }];
      expect(weekScheduleSlotStartPlaceholder(slots, 1)).toBe(firstSlot.startTime);
    });
  });

  describe('nextWeekScheduleSlotRow', () => {
    it('returns default row when there are no slots yet', () => {
      expect(nextWeekScheduleSlotRow([])).toEqual(defaultWeekScheduleSlotRow());
    });

    it('suggests the next slot with the same duration as the previous row', () => {
      const slots = [{ startTime: '08:15', finishTime: '09:15' }];
      expect(nextWeekScheduleSlotRow(slots)).toEqual({
        startTime: '09:15',
        finishTime: '10:15',
      });
    });
  });

  describe('maxSlotRowsForTemplate', () => {
    it('divides weekly hours by selected days (ceil if remainder)', () => {
      expect(maxSlotRowsForTemplate(6, 1)).toBe(6);
      expect(maxSlotRowsForTemplate(6, 2)).toBe(3);
      expect(maxSlotRowsForTemplate(6, 5)).toBe(2);
      expect(maxSlotRowsForTemplate(7, 5)).toBe(2);
    });

    it('returns null for invalid totals', () => {
      expect(maxSlotRowsForTemplate(0, 3)).toBeNull();
      expect(maxSlotRowsForTemplate(6, 0)).toBeNull();
    });
  });
});
