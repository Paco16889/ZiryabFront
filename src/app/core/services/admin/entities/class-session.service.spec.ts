import { TestBed } from '@angular/core/testing';

import { ClassSessionService } from './class-session.service';

describe('ClassSessionService', () => {
  let service: ClassSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
