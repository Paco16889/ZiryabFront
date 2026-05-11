import { TestBed } from '@angular/core/testing';

import { ListRefreshService } from './list-refresh.service';

describe('ListRefreshService', () => {
  let service: ListRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListRefreshService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
