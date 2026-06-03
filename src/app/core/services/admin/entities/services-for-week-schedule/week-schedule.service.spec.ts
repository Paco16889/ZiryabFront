import { TestBed } from '@angular/core/testing';

import { WeekScheduleService } from './week-schedule.service';

describe('WeekScheduleService', () => {
  let service: WeekScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
