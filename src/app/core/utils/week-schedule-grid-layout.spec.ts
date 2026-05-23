import { gridLayoutFromWeekSchedules } from './week-schedule-grid-layout';

describe('gridLayoutFromWeekSchedules', () => {
  it('derives unique sorted days and slots from template rows', () => {
    const layout = gridLayoutFromWeekSchedules([
      {
        id: 1,
        weekDay: 3,
        startTime: '10:15',
        finishTime: '11:15',
        label: '1º DAM — Mañana',
        teacherAssignment: null,
      },
      {
        id: 2,
        weekDay: 1,
        startTime: '08:15',
        finishTime: '09:15',
        label: '1º DAM — Mañana',
        teacherAssignment: null,
      },
      {
        id: 3,
        weekDay: 1,
        startTime: '09:15',
        finishTime: '10:15',
        label: '1º DAM — Mañana',
        teacherAssignment: null,
      },
    ]);

    expect(layout.weekDays).toEqual([1, 3]);
    expect(layout.slots).toEqual([
      { startTime: '08:15', finishTime: '09:15' },
      { startTime: '09:15', finishTime: '10:15' },
      { startTime: '10:15', finishTime: '11:15' },
    ]);
  });
});
