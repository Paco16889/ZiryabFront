import { TestBed } from '@angular/core/testing';

import { CreateFormStateServiceService } from './create-form-state-service.service';

describe('CreateFormStateServiceService', () => {
  let service: CreateFormStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateFormStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
