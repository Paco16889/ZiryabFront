import { TestBed } from '@angular/core/testing';

import { FloatMenuService } from './float-menu.service';

describe('FloatMenuService', () => {
  let service: FloatMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FloatMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
