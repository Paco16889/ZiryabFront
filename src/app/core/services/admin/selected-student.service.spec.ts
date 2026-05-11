import { TestBed } from '@angular/core/testing';

import { SelectedStudentService } from './selected-student.service';

describe('SelectedStudentService', () => {
  let service: SelectedStudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedStudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
