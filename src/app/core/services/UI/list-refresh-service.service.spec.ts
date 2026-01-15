import { TestBed } from '@angular/core/testing';

import { ListRefreshServiceService } from './list-refresh-service.service';

describe('ListRefreshServiceService', () => {
  let service: ListRefreshServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListRefreshServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
