import { TestBed } from '@angular/core/testing';

import { NotificationToggleService } from './notification-toggle.service';

describe('NotificationToggleService', () => {
  let service: NotificationToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
