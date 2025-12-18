import { TestBed } from '@angular/core/testing';

import { SubjectServiceService } from './alumno/subject-service.service';

describe('SubjectServiceService', () => {
  let service: SubjectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
