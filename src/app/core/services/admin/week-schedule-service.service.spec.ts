import { TestBed } from '@angular/core/testing';

import { WeekScheduleServiceService } from './week-schedule-service.service';

describe('WeekScheduleServiceService', () => {
  let service: WeekScheduleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekScheduleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
