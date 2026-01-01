import { TestBed } from '@angular/core/testing';

import { SelectedStudentServiceService } from './selected-student-service.service';

describe('SelectedStudentServiceService', () => {
  let service: SelectedStudentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedStudentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
