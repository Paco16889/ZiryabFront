import { TestBed } from '@angular/core/testing';

import { ClassSessionServiceService } from './class-session-service.service';

describe('ClassSessionServiceService', () => {
  let service: ClassSessionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSessionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
