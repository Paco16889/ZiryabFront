import { TestBed } from '@angular/core/testing';

import { StudentRegistrationService } from './admin/student-registration.service';

describe('StudentRegistrationService', () => {
  let service: StudentRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
