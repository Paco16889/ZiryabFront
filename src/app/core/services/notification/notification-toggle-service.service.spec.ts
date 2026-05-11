import { TestBed } from '@angular/core/testing';

import { NotificationToggleServiceService } from './notification-toggle-service.service';

describe('NotificationToggleServiceService', () => {
  let service: NotificationToggleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationToggleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
