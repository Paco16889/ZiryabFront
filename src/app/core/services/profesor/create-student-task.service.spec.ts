import { TestBed } from '@angular/core/testing';

import { CreateStudentTaskService } from './create-student-task.service';

describe('CreateStudentTaskService', () => {
  let service: CreateStudentTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateStudentTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
