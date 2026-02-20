import { TestBed } from '@angular/core/testing';

import { StudentTaskServiceService } from './student-task-service.service';

describe('StudentTaskServiceService', () => {
  let service: StudentTaskServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentTaskServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
