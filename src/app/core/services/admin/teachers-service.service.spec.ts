import { TestBed } from '@angular/core/testing';

import { TeachersServiceService } from './teachers-service.service';

describe('TeachersServiceService', () => {
  let service: TeachersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeachersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
